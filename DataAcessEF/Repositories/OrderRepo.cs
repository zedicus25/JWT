using DataAcessEF.Data;
using Domain.Interfaces;
using Domain.Models;


namespace DataAcessEF.Repositories
{
    public class OrderRepo : GenericRepo<Order>, IOrderRepository
    {
        public OrderRepo(AssetStoreDbContext dbContext) : base(dbContext)
        {
        }
    }
}
