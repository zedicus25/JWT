
using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class OrderLine
    {
        [Key]
        public int Id { get; set; }
        public int? OrderId { get; set; }
        public int? ProductId { get; set; }

        public virtual Order? Order { get; set; }
        public virtual ICollection<Product> Products { get; } = new List<Product>();
    }
}
