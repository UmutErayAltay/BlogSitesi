using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;
using Blog.API.Data;
using Blog.API.Models;

[ApiController]
[Route("api/[controller]")]
public class SitemapController : ControllerBase
{
    private readonly BlogDbContext _context;
    private readonly IConfiguration _configuration;

    public SitemapController(BlogDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetSitemap()
    {
        var domain = _configuration["Domain"] ?? "https://yourdomain.com";
        
        var sitemap = new XDocument(
            new XDeclaration("1.0", "utf-8", null),
            new XElement("urlset",
                new XAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9"),
                
                // Ana sayfa
                new XElement("url",
                    new XElement("loc", domain),
                    new XElement("lastmod", DateTime.UtcNow.ToString("yyyy-MM-dd")),
                    new XElement("changefreq", "daily"),
                    new XElement("priority", "1.0")
                ),
                
                // Hakkında sayfası
                new XElement("url",
                    new XElement("loc", $"{domain}/about"),
                    new XElement("lastmod", DateTime.UtcNow.ToString("yyyy-MM-dd")),
                    new XElement("changefreq", "monthly"),
                    new XElement("priority", "0.8")
                )
            )
        );

        // Blog yazıları için URL'ler
        var posts = await _context.BlogPosts
            .Where(p => p.Status == "published")
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        foreach (var post in posts)
        {
            sitemap.Root.Add(
                new XElement("url",
                    new XElement("loc", $"{domain}/blog/{post.Id}"),
                    new XElement("lastmod", post.UpdatedAt?.ToString("yyyy-MM-dd") ?? post.CreatedAt.ToString("yyyy-MM-dd")),
                    new XElement("changefreq", "weekly"),
                    new XElement("priority", "0.9")
                )
            );
        }

        return Content(sitemap.ToString(), "application/xml");
    }
} 