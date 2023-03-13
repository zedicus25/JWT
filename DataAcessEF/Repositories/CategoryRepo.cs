using DataAcessEF.Data;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAcessEF.Repositories
{
    public class CategoryRepo : GenericRepo<Category>, ICategoryRepository
    {
        public CategoryRepo(AssetStoreDbContext dbContext) : base(dbContext)
        {
        }

        public Task<int> GetCountInCategory(int id) => _dbContext.Products.Where(x => x.CategoryId == id && x.StatusId != 3).CountAsync();
    }
}
