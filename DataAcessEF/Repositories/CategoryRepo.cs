using DataAcessEF.Data;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAcessEF.Repositories
{
    public class CategoryRepo : GenericRepo<Category>, ICategoryRepository
    {
        public CategoryRepo(SmartphonesDbContext dbContext) : base(dbContext)
        {
        }

        public Task<int> GetCountInCategory(int id) => _dbContext.Smartphones.Where(x => x.CategoryId == id).CountAsync();

    }
}
