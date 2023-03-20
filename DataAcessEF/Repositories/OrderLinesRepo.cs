using DataAcessEF.Data;
using Domain.Interfaces;
using Domain.Models;


namespace DataAcessEF.Repositories
{
    public class OrderLinesRepo : GenericRepo<OrderLine>, IOrderLinesRepository
    {
        public OrderLinesRepo(AssetStoreDbContext dbContext) : base(dbContext)
        {
        }
    }
}
