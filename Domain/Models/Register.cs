using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class Register
    {
        [Required(ErrorMessage = "User name is  Required! ")]
        public string? UserName { get; set; }
        [Required(ErrorMessage = "User name is  Required! ")]
        public string? Password { get; set; }
        [Required(ErrorMessage = "Email name is  Required! ")]
        public string? Email { get; set; }
    }
}
