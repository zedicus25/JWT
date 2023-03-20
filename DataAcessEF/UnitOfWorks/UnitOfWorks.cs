using DataAcessEF.Data;
using DataAcessEF.Repositories;
using Domain.Interfaces;
using Domain.Interfaces.UnitOfWorks;

namespace DataAcessEF.UnitOfWorks
{
    public class UnitOfWorks : IUnitOfWorks
    {

        public ICategoryRepository CategoryRepository { get; }

        public IProductRepository ProductRepository { get; }

        public ISubCategoryRepository SubCategoryRepository { get; }

        public IOrderRepository OrderRepository { get; }

        public IOrderLinesRepository OrderLinesRepository { get; }

        private readonly AssetStoreDbContext _dbContext;

        public UnitOfWorks(AssetStoreDbContext context)
        {
            _dbContext = context;
            CategoryRepository = new CategoryRepo(_dbContext);
            ProductRepository = new ProductRepo(_dbContext);
            SubCategoryRepository = new SubCategoryRepo(_dbContext);
            OrderRepository = new OrderRepo(_dbContext);
            OrderLinesRepository = new OrderLinesRepo(_dbContext);
        }

        public int Commit() => _dbContext.SaveChanges();
    

        public void Dispose() => _dbContext.Dispose();
      
    }
}
