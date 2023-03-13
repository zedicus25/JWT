
using Domain.Models;

namespace Domain.Interfaces
{
    public interface IProductRepository: IGenericRepository<Product>
    {
        Task<List<Product>> GetByCategoryId(int id);

        void SetStatus(int smartphoneId, int statusId);

        Product GetProductById(int smartphoneId);
        IEnumerable<Product> GetProductInSubCategories(int[] categotiesId, int categoryId);

        void UpdateCategoryId(int productId, int categoryId);

        void UpdateSubCategoryId(int productId, int subCategoryId);
    }
}
