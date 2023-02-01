namespace Domain.Models
{
    public class SubCategory
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public virtual ICollection<Product> Products { get; } = new List<Product>();
    }
}
