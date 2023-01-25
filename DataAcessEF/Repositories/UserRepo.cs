using DataAcessEF.Data;
using Domain;
using Domain.Interfaces;
using Domain.Models;

namespace DataAcessEF.Repositories
{
    public class UserRepo : GenericRepo<User>, IUserRepository
    {
        public UserRepo(SmartphonesDbContext dbContext) : base(dbContext)
        {
        }

        public override void Add(User item)
        {
            item.Password = PasswordHasher.HashPassword(item.Password);
            _dbContext.Set<User>().Add(item);
        }

        public bool CheckPassword(User user)
        {
            var userInDb = _dbContext.Users.FirstOrDefault(x => x.Login == user.Login);
            if (userInDb == null)
                return false;
            return PasswordHasher.VerifyHashedPassword(userInDb.Password, user.Password);
        }
    }
}
