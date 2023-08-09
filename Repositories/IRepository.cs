namespace Backend.Repositories
{
    public interface IRepository<T> where T : class
    {
        T? FindById(Guid id);
        IEnumerable<T> FindAll();
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}
