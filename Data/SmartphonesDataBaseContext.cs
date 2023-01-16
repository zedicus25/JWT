using JWT.Models;
using Microsoft.EntityFrameworkCore;

namespace JWT.Data;

public partial class SmartphonesDataBaseContext : DbContext
{
    protected readonly IConfiguration Configuration;
    public SmartphonesDataBaseContext(IConfiguration configuration)
    {
        Configuration = configuration;
    }
    

    public virtual DbSet<Smartphone> Smartphones { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Smartphone>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__smartpho__3214EC0707BD3A4A");

            entity.ToTable("smartphones");

            entity.Property(e => e.Model).HasMaxLength(150);
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Photo).HasMaxLength(500);
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
