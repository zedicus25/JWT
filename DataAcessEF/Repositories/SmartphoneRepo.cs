using DataAcessEF.Data;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAcessEF.Repositories
{
    public class ProductRepo : GenericRepo<Product>, IProductRepository
    {
        public ProductRepo(AssetStoreDbContext dbContext) : base(dbContext)
        {
        }

        public Task<List<Product>> GetByCategoryId(int id) => 
            _dbContext.Products.Where(x => x.CategoryId == id && x.StatusId != 3).ToListAsync();

        public Product GetProductById(int smartphoneId) => _dbContext.Products.FirstOrDefault(x => x.Id == smartphoneId);
     

        public void SetStatus(int smartphoneId, int statusId)
        {
            var smartphone = _dbContext.Products.FirstOrDefault(x => x.Id == smartphoneId);
            if(smartphone != null)
            {
                smartphone.StatusId = statusId;
                _dbContext.Entry(smartphone).State = EntityState.Modified;
            }
        }
    }
}
