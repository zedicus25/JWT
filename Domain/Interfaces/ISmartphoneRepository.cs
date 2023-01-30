
using Domain.Models;

namespace Domain.Interfaces
{
    public interface ISmartphoneRepository: IGenericRepository<Smartphone>
    {
        Task<List<Smartphone>> GetByCategoryId(int id);

        void SetStatus(int smartphoneId, int statusId);

        Smartphone GetSmartphoneById(int smartphoneId);
    }
}
