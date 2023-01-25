using DataAcessEF.Data;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAcessEF.Repositories
{
    public class GenericRepo<T> : IGenericRepository<T> where T : class
    {
        protected readonly SmartphonesDbContext _dbContext;

        public GenericRepo(SmartphonesDbContext dbContext)
        {
            this._dbContext = dbContext;
        }

        public void Add(T item) => _dbContext.Set<T>().Add(item);
       

        public void Delete(T item)
        {
            var itemForDelete = _dbContext.Set<T>().Find(item);
            _dbContext.Set<T>().Remove(itemForDelete);
        }

        public async Task<IEnumerable<T>> GetAll() => await  _dbContext.Set<T>().ToListAsync();


        public async Task<T> GetById(int id) => await _dbContext.Set<T>().FindAsync(id);

        public void Update(T item)
        {
            throw new NotImplementedException();
        }
    }
}
