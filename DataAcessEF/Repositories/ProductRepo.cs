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

        public IEnumerable<Product> GetProductInSubCategories(int[] categotiesId, int categoryId)
        {
            List<Product> products = new List<Product>();
            foreach (var id in categotiesId)
            {
                products.AddRange(_dbContext.Products.Where(x => x.SubCategoryId == id && x.CategoryId == categoryId));
            }
            return products.ToList();
        }

        public void SetStatus(int smartphoneId, int statusId)
        {
            var smartphone = _dbContext.Products.FirstOrDefault(x => x.Id == smartphoneId);
            if(smartphone != null)
            {
                smartphone.StatusId = statusId;
                _dbContext.Entry(smartphone).State = EntityState.Modified;
            }
        }

        public void UpdateCategoryId(int productId, int categoryId)
        {
            var smartphone = _dbContext.Products.FirstOrDefault(x => x.Id == productId);
            if (smartphone != null)
            {
                smartphone.CategoryId = categoryId;
                _dbContext.Entry(smartphone).State = EntityState.Modified;
            }
        }

        public void UpdateSubCategoryId(int productId, int subCategoryId)
        {
            var smartphone = _dbContext.Products.FirstOrDefault(x => x.Id == productId);
            if (smartphone != null)
            {
                smartphone.SubCategoryId = subCategoryId;
                _dbContext.Entry(smartphone).State = EntityState.Modified;
            }
        }
    }
}
