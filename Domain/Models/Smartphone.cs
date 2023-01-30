namespace Domain.Models
{
    public class Smartphone
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Model { get; set; } = null!;

        public double? Price { get; set; }

        public string? Photo { get; set; }

        public int? CategoryId { get; set; }

        public int? Quantity {get; set;}
        public int? Sold {get; set;}

        public int? StatusId { get; set; }

        public virtual Category? Category { get; set; }
        public virtual Status? Status { get; set; }
    }
}
