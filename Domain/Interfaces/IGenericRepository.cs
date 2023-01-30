namespace Domain.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
       Task<IEnumerable<T>> GetAll();
        Task<T> GetById(int id);
        void Add(T item);
        void Delete(int id);
        void Update(T item);    
    }
}
