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

        public virtual void Add(T item) => _dbContext.Set<T>().Add(item);
       

        public virtual void Delete(T item)
        {
            var itemForDelete = _dbContext.Set<T>().Find(item);
            _dbContext.Set<T>().Remove(itemForDelete);
        }

        public virtual async Task<IEnumerable<T>> GetAll() => await  _dbContext.Set<T>().ToListAsync();


        public virtual async Task<T> GetById(int id) => await _dbContext.Set<T>().FindAsync(id);

        public virtual void Update(T item)
        {
            throw new NotImplementedException();
        }
    }
}
