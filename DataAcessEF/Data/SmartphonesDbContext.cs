using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAcessEF.Data
{
    public partial class SmartphonesDbContext : DbContext
    {
        public SmartphonesDbContext(DbContextOptions options) : base(options)
        {
        }

        public virtual DbSet<Category> Categories { get; set; }

        public virtual DbSet<Smartphone> Smartphones { get; set; }

        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC078ACD2D54");

                entity.Property(e => e.Name).HasMaxLength(50);
            });

            modelBuilder.Entity<Smartphone>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__smartpho__3214EC0707BD3A4A");

                entity.ToTable("smartphones");

                entity.Property(e => e.Model).HasMaxLength(150);
                entity.Property(e => e.Name).HasMaxLength(150);
                entity.Property(e => e.Photo).HasMaxLength(500);

                entity.HasOne(d => d.Category).WithMany(p => p.Smartphones)
                    .HasForeignKey(d => d.CategoryId)
                    .HasConstraintName("FK__smartphon__Categ__5CD6CB2B");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Login).HasMaxLength(30);
                entity.Property(e => e.Password).HasMaxLength(400);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
