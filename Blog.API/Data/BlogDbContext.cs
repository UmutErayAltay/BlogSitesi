using Microsoft.EntityFrameworkCore;
using Blog.API.Models;
using Microsoft.AspNetCore.Identity;

namespace Blog.API.Data
{
    public class BlogDbContext : DbContext
    {
        private readonly IPasswordHasher<User> _passwordHasher;

        public BlogDbContext(DbContextOptions<BlogDbContext> options)
            : base(options)
        {
            _passwordHasher = new PasswordHasher<User>();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<About> Abouts { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Admin kullanıcısını oluştur
            var adminUser = new User
            {
                Id = 1,
                Username = "admin",
                Email = "admin@blog.com",
                Role = "admin",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            // Şifreyi hashle
            adminUser.PasswordHash = _passwordHasher.HashPassword(adminUser, "Admin123!");

            // Admin kullanıcısını seed data olarak ekle
            modelBuilder.Entity<User>().HasData(adminUser);

            // User
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // BlogPost
            modelBuilder.Entity<BlogPost>()
                .HasOne(p => p.Author)
                .WithMany()
                .HasForeignKey(p => p.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Comment
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Author)
                .WithMany()
                .HasForeignKey(c => c.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.BlogPost)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.Restrict);

            // About
            modelBuilder.Entity<About>()
                .HasOne(a => a.UpdatedBy)
                .WithMany()
                .HasForeignKey(a => a.UpdatedById)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
} 