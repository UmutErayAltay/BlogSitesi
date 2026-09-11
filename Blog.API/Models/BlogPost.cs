namespace Blog.API.Models
{
    using System.ComponentModel.DataAnnotations;

    public class BlogPost
    {
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        [Required]
        public string Summary { get; set; } = string.Empty;
        
        [Required]
        public string Category { get; set; } = string.Empty;
        
        [Required]
        public string ImageUrl { get; set; } = string.Empty;
        
        [Required]
        public string Status { get; set; } = "draft";
        
        public DateTime Date { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int Views { get; set; }
        public int Likes { get; set; }
        public int AuthorId { get; set; }
        
        [Required]
        public User Author { get; set; } = null!;
        
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
} 