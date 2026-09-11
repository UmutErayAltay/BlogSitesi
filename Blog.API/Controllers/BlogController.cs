using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Blog.API.Data;
using Blog.API.Models;
using Blog.API.Dtos;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace Blog.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly BlogDbContext _context;
        private readonly ILogger<BlogController> _logger;

        public BlogController(BlogDbContext context, ILogger<BlogController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts()
        {
            try
            {
                var posts = await _context.BlogPosts
                    .Include(p => p.Author)
                    .Where(p => p.Status == "published") // Sadece yayınlanmış postları getir
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Bloglar listelenirken hata");
                return StatusCode(500, new { message = "Bloglar listelenirken bir hata oluştu" });
            }
        }

        [Authorize] // Admin paneli için yeni endpoint
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllPosts()
        {
            try
            {
                var posts = await _context.BlogPosts
                    .Include(p => p.Author)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync(); // Tüm postları getir (taslak ve yayınlanmış)

                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Bloglar listelenirken hata");
                return StatusCode(500, new { message = "Bloglar listelenirken bir hata oluştu" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            var post = await _context.BlogPosts
                .Include(p => p.Author)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.Author)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
                return NotFound();

            // Yanıt için yeni bir anonim nesne oluştur
            var response = new
            {
                id = post.Id,
                title = post.Title,
                content = post.Content,
                summary = post.Summary,
                category = post.Category,
                imageUrl = post.ImageUrl,
                date = post.Date,
                createdAt = post.CreatedAt,
                updatedAt = post.UpdatedAt,
                author = new
                {
                    id = post.Author.Id,
                    name = post.Author.Username
                },
                comments = post.Comments.Select(c => new
                {
                    id = c.Id,
                    content = c.Content,
                    createdAt = c.CreatedAt,
                    author = new
                    {
                        id = c.Author.Id,
                        name = c.Author.Username,
                        avatar = c.Author.Avatar
                    }
                }).OrderByDescending(c => c.createdAt)
            };

            return Ok(response);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] CreateBlogPostDto postData)
        {
            try
            {
                _logger.LogInformation($"Gelen veri: {System.Text.Json.JsonSerializer.Serialize(postData)}");

                if (string.IsNullOrWhiteSpace(postData.Title) || string.IsNullOrWhiteSpace(postData.Content))
                {
                    return BadRequest(new { message = "Başlık ve içerik alanları zorunludur" });
                }

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized(new { message = "Kullanıcı kimliği bulunamadı" });

                var userId = int.Parse(userIdClaim.Value);
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return NotFound(new { message = "Kullanıcı bulunamadı" });

                var post = new BlogPost
                {
                    Title = postData.Title,
                    Content = postData.Content,
                    Summary = postData.Summary,
                    Category = postData.Category,
                    ImageUrl = postData.ImageUrl,
                    Status = postData.Status,
                    Date = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null,
                    Views = 0,
                    Likes = 0,
                    AuthorId = userId,
                    Author = user
                };

                _context.BlogPosts.Add(post);
                await _context.SaveChangesAsync();

                return Ok(post);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Blog post oluşturulurken hata: {ex.Message}");
                return StatusCode(500, new { message = "Blog yazısı oluşturulurken bir hata oluştu", error = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] UpdateBlogPostDto postData)
        {
            try 
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var existingPost = await _context.BlogPosts
                    .Include(p => p.Author)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (existingPost == null)
                    return NotFound(new { message = "Blog yazısı bulunamadı" });

                if (existingPost.AuthorId != userId && !User.IsInRole("admin"))
                    return Forbid();

                existingPost.Title = postData.Title;
                existingPost.Content = postData.Content;
                existingPost.Summary = postData.Summary;
                existingPost.Category = postData.Category;
                existingPost.ImageUrl = postData.ImageUrl;
                existingPost.Status = postData.Status;
                existingPost.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(existingPost);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Blog güncellenirken hata");
                return StatusCode(500, new { message = "Blog güncellenirken bir hata oluştu" });
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var post = await _context.BlogPosts.FindAsync(id);

            if (post == null)
                return NotFound();

            if (post.AuthorId != userId && !User.IsInRole("admin"))
                return Forbid();

            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            try
            {
                return Ok(new { message = "API bağlantısı başarılı", timestamp = DateTime.UtcNow });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Test endpoint hatası");
                return StatusCode(500, new { message = "Test başarısız", error = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchPosts([FromQuery] string q)
        {
            try
            {
                var posts = await _context.BlogPosts
                    .Include(p => p.Author)
                    .Where(p => p.Status == "published" &&
                        (p.Title.Contains(q) || p.Content.Contains(q) || p.Summary.Contains(q)))
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Blog arama hatası");
                return StatusCode(500, new { message = "Arama sırasında bir hata oluştu" });
            }
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetPostsByCategory(string categoryId)
        {
            try
            {
                var posts = await _context.BlogPosts
                    .Include(p => p.Author)
                    .Where(p => p.Status == "published" && p.Category == categoryId)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kategori postları getirme hatası");
                return StatusCode(500, new { message = "Kategori postları getirilirken bir hata oluştu" });
            }
        }

        [Authorize]
        [HttpPost("{postId}/comments")]
        public async Task<IActionResult> AddComment(int postId, [FromBody] AddCommentDto commentDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var user = await _context.Users.FindAsync(userId);
                var post = await _context.BlogPosts.FindAsync(postId);

                if (post == null)
                    return NotFound(new { message = "Blog yazısı bulunamadı" });

                var comment = new Comment
                {
                    Content = commentDto.Content,
                    AuthorId = userId,
                    PostId = postId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                // Yanıt için yeni bir anonim nesne oluştur
                var response = new
                {
                    id = comment.Id,
                    content = comment.Content,
                    createdAt = comment.CreatedAt,
                    author = new
                    {
                        id = user!.Id,
                        name = user.Username,
                        avatar = user.Avatar
                    },
                    postId = comment.PostId
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorum ekleme hatası");
                return StatusCode(500, new { message = "Yorum eklenirken bir hata oluştu" });
            }
        }

        [Authorize]
        [HttpPut("comments/{commentId}")]
        public async Task<IActionResult> UpdateComment(int commentId, [FromBody] AddCommentDto commentDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var comment = await _context.Comments
                    .Include(c => c.Author)
                    .FirstOrDefaultAsync(c => c.Id == commentId);

                if (comment == null)
                    return NotFound(new { message = "Yorum bulunamadı" });

                // Sadece yorum sahibi düzenleyebilir
                if (comment.AuthorId != userId)
                    return new ForbidResult();

                comment.Content = commentDto.Content;
                await _context.SaveChangesAsync();

                var response = new
                {
                    id = comment.Id,
                    content = comment.Content,
                    createdAt = comment.CreatedAt,
                    author = new
                    {
                        id = comment.Author.Id,
                        name = comment.Author.Username,
                        avatar = comment.Author.Avatar
                    },
                    postId = comment.PostId
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorum düzenleme hatası");
                return StatusCode(500, new { message = "Yorum düzenlenirken bir hata oluştu" });
            }
        }

        [Authorize]
        [HttpDelete("comments/{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var isAdmin = User.IsInRole("admin");
                
                var comment = await _context.Comments.FindAsync(commentId);

                if (comment == null)
                    return NotFound(new { message = "Yorum bulunamadı" });

                // Admin tüm yorumları, kullanıcı sadece kendi yorumlarını silebilir
                if (!isAdmin && comment.AuthorId != userId)
                    return new ForbidResult();

                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorum silme hatası");
                return StatusCode(500, new { message = "Yorum silinirken bir hata oluştu" });
            }
        }
    }
} 