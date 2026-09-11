using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Blog.API.Data;
using Blog.API.Models;

namespace Blog.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AboutController : ControllerBase
    {
        private readonly BlogDbContext _context;

        public AboutController(BlogDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAbout()
        {
            try 
            {
                var about = await _context.Abouts
                    .Include(a => a.UpdatedBy)
                    .FirstOrDefaultAsync();

                // Eğer kayıt yoksa boş bir about döndür
                if (about == null)
                {
                    return Ok(new About 
                    { 
                        Content = "",
                        LastUpdated = DateTime.UtcNow
                    });
                }

                return Ok(about);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hata: {ex.Message}");
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPut]
        public async Task<IActionResult> UpdateAbout([FromBody] string content)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var about = await _context.Abouts.FirstOrDefaultAsync();

                if (about == null)
                {
                    about = new About
                    {
                        Content = content,
                        LastUpdated = DateTime.UtcNow,
                        UpdatedById = userId
                    };
                    _context.Abouts.Add(about);
                }
                else
                {
                    about.Content = content;
                    about.LastUpdated = DateTime.UtcNow;
                    about.UpdatedById = userId;
                }

                await _context.SaveChangesAsync();
                return Ok(about);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hata: {ex.Message}");
            }
        }
    }
} 