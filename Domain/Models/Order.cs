using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public DateTime OrderTime { get; set; }

        public double? TotalPrice { get; set; }

        public string? UserId { get; set; }
        public int? ProductsCount { get; set; }
    }
}
