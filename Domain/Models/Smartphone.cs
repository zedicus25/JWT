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

        public virtual Category? Category { get; set; }
    }
}
