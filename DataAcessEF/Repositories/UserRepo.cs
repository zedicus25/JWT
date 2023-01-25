using DataAcessEF.Data;
using Domain.Interfaces;
using Domain.Models;

namespace DataAcessEF.Repositories
{
    public class UserRepo : GenericRepo<User>, IUserRepository
    {
        public UserRepo(SmartphonesDbContext dbContext) : base(dbContext)
        {
        }
    }
}
