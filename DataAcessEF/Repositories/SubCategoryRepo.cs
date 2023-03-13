using DataAcessEF.Data;
using Domain.Interfaces;
using Domain.Models;


namespace DataAcessEF.Repositories
{
    public class SubCategoryRepo : GenericRepo<SubCategory>, ISubCategoryRepository
    {
        public SubCategoryRepo(AssetStoreDbContext dbContext) : base(dbContext)
        {
        }
    }
}
