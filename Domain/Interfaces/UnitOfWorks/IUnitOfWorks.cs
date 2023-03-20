namespace Domain.Interfaces.UnitOfWorks
{
    public interface IUnitOfWorks : IDisposable
    {
        public ICategoryRepository CategoryRepository { get; }
        public IProductRepository ProductRepository { get; }
        public ISubCategoryRepository SubCategoryRepository { get; }
        public IOrderRepository OrderRepository { get; }
        public IOrderLinesRepository OrderLinesRepository { get; }

        int Commit();
    }
}
