using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Blog.API.Data;
using Blog.API.Models;
using Blog.API.Services;
using Blog.API.Dtos;
using Microsoft.Extensions.Logging;

namespace Blog.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly BlogDbContext _context;
        private readonly JwtService _jwtService;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            BlogDbContext context,
            JwtService jwtService,
            IPasswordHasher<User> passwordHasher,
            ILogger<AuthController> logger)
        {
            _context = context;
            _jwtService = jwtService;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Geçersiz form verileri" });
                }

                if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                {
                    return BadRequest(new { message = "Tüm alanlar zorunludur" });
                }

                if (await _context.Users.AnyAsync(u => u.Email == model.Email))
                {
                    return BadRequest(new { message = "Bu email adresi zaten kullanılıyor" });
                }

                var user = new User
                {
                    Username = model.Username,
                    Email = model.Email,
                    Role = "user", // Varsayılan rol
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                user.PasswordHash = _passwordHasher.HashPassword(user, model.Password);
                
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Kayıt başarılı" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kayıt sırasında hata");
                return StatusCode(500, new { message = "Kayıt sırasında bir hata oluştu" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
                if (user == null)
                    return BadRequest(new { message = "Geçersiz email veya şifre" });

                var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.Password);
                if (result == PasswordVerificationResult.Failed)
                    return BadRequest(new { message = "Geçersiz email veya şifre" });

                var token = _jwtService.GenerateToken(user);
                user.LastLogin = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                _logger.LogInformation("User logged in successfully: {Email}", user.Email);
                return Ok(new
                {
                    token,
                    user = new
                    {
                        user.Id,
                        user.Username,
                        user.Email,
                        user.Role
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { message = "Giriş sırasında bir hata oluştu" });
            }
        }

        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdmin()
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.Email == "admin@blog.com"))
                    return BadRequest(new { message = "Admin hesabı zaten var" });

                var adminUser = new User
                {
                    Username = "admin",
                    Email = "admin@blog.com",
                    Role = "admin",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                adminUser.PasswordHash = _passwordHasher.HashPassword(adminUser, "Admin123!");
                _context.Users.Add(adminUser);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Admin user created successfully");
                return Ok(new { message = "Admin hesabı oluşturuldu" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating admin user");
                return StatusCode(500, new { message = "Admin hesabı oluşturulurken hata oluştu" });
            }
        }
    }
} 