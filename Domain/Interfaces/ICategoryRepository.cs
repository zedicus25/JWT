using Domain.Models;

namespace Domain.Interfaces
{
    public interface ICategoryRepository : IGenericRepository<Category>
    {
        Task<int> GetCountInCategory(int id);
    }
}
