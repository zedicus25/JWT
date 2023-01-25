using Domain.Models;

namespace Domain.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        bool CheckPassword(User user);
    }
}
