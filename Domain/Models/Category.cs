namespace Domain.Models
{
    public class Category
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public virtual ICollection<Smartphone> Smartphones { get; } = new List<Smartphone>();
    }
}
