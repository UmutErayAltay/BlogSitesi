namespace Blog.API.Models
{
    public class About
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
        public int UpdatedById { get; set; }
        public User UpdatedBy { get; set; } = null!;
    }
} 