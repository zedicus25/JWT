using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace DataAcessEF.Data
{
    public partial class SmartphonesDbContext : IdentityDbContext<IdentityUser>
    {
        protected readonly IConfiguration Configuration;
        public SmartphonesDbContext(DbContextOptions configuration) : base(configuration)
        {
        }

        public virtual DbSet<Category> Categories { get; set; }

        public virtual DbSet<Smartphone> Smartphones { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
