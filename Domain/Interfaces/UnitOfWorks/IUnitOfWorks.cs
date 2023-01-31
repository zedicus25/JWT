namespace Domain.Interfaces.UnitOfWorks
{
    public interface IUnitOfWorks : IDisposable
    {
        public ICategoryRepository CategoryRepository { get; }
        public ISmartphoneRepository SmartphoneRepository { get; }

        int Commit();
    }
}
