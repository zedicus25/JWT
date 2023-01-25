using DataAcessEF.Data;
using Domain.Interfaces;
using Domain.Models;

namespace DataAcessEF.Repositories
{
    public class SmartphoneRepo : GenericRepo<Smartphone>, ISmartphoneRepository
    {
        public SmartphoneRepo(SmartphonesDbContext dbContext) : base(dbContext)
        {
        }
    }
}
