using System.ComponentModel.DataAnnotations;

namespace Blog.API.Dtos
{
    public class AddCommentDto
    {
        [Required(ErrorMessage = "Yorum içeriği zorunludur")]
        [MinLength(1, ErrorMessage = "Yorum içeriği boş olamaz")]
        [MaxLength(1000, ErrorMessage = "Yorum içeriği 1000 karakterden uzun olamaz")]
        public string Content { get; set; } = string.Empty;
    }
} 