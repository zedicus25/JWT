using DataAcessEF.Data;
using DataAcessEF.Repositories;
using Domain.Interfaces;
using Domain.Interfaces.UnitOfWorks;

namespace DataAcessEF.UnitOfWorks
{
    public class UnitOfWorks : IUnitOfWorks
    {

        public ICategoryRepository CategoryRepository { get; }

        public ISmartphoneRepository SmartphoneRepository { get; }

        private readonly SmartphonesDbContext _dbContext;

        public UnitOfWorks(SmartphonesDbContext context)
        {
            _dbContext = context;
            CategoryRepository = new CategoryRepo(_dbContext);
            SmartphoneRepository = new SmartphoneRepo(_dbContext);
        }

        public int Commit() => _dbContext.SaveChanges();
    

        public void Dispose() => _dbContext.Dispose();
      
    }
}
