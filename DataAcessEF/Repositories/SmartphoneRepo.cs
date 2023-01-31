using DataAcessEF.Data;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAcessEF.Repositories
{
    public class SmartphoneRepo : GenericRepo<Smartphone>, ISmartphoneRepository
    {
        public SmartphoneRepo(SmartphonesDbContext dbContext) : base(dbContext)
        {
        }

        public Task<List<Smartphone>> GetByCategoryId(int id) => 
            _dbContext.Smartphones.Where(x => x.CategoryId == id && x.StatusId != 3).ToListAsync();

        public Smartphone GetSmartphoneById(int smartphoneId) => _dbContext.Smartphones.FirstOrDefault(x => x.Id == smartphoneId);
     

        public void SetStatus(int smartphoneId, int statusId)
        {
            var smartphone = _dbContext.Smartphones.FirstOrDefault(x => x.Id == smartphoneId);
            if(smartphone != null)
            {
                smartphone.StatusId = statusId;
                _dbContext.Entry(smartphone).State = EntityState.Modified;
            }
        }
    }
}
