namespace Domain.Interfaces.UnitOfWorks
{
    public interface IUnitOfWorks : IDisposable
    {
        public IUserRepository UserRepository { get; }
        public ICategoryRepository CategoryRepository { get; }
        public ISmartphoneRepository SmartphoneRepository { get; }

        int Commit();
    }
}
