using Data.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Data.EF
{
    public class EFRepository<T, K> : Data.Interfaces.IRepository<T, K> where T : class, Data.Interfaces.IEntity<K>
    {
        private readonly ProjectDbContext _context;

        public EFRepository(ProjectDbContext context)
        {
            _context = context;
        }

        public IQueryable<T> GetAll()
        {
            var l_Records = from record in _context.Set<T>() select record;
            return l_Records;
        }

        public IQueryable<T> GetAll(params Expression<Func<T,object>>[] navigationProperties)
        {
            IQueryable<T> entity = _context.Set<T>();
            foreach (var navigationProperty in navigationProperties)
            {
                entity = entity.Include(navigationProperty);
            }
            var l_records = from record in entity select record;
            return l_records;
        }

        public T FindById(K id)
        {
            return _context.Set<T>().SingleOrDefault(x => x.Id.Equals(id));
        }

        public T FindById(K id, params Expression<Func<T, object>>[] navigationProperties)
        {
            return GetAll(navigationProperties).SingleOrDefault(x => x.Id.Equals(id));
        }

        public Task<T> FindByIdAsyn(K id)
        {
            return _context.Set<T>().SingleOrDefaultAsync(x => x.Id.Equals(id));
        }

        public T FindSingle(Expression<Func<T, bool>> predicate)
        {
            return _context.Set<T>().FirstOrDefault(predicate);
        }

        public T FindSingle(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] navigationProperties)
        {
            IQueryable<T> entity = _context.Set<T>();
            //Eagerly loading
            foreach (var navigationProperty in navigationProperties)
            {
                entity = entity.Include(navigationProperty);
            }
            return entity.SingleOrDefault(predicate);
        }

        public IQueryable<T> FindMultiple(Expression<Func<T, bool>> predicate)
        {
            return _context.Set<T>().Where(predicate);
        }

        //public IQueryable<T> FindAll(params Expression<Func<T, object>>[] navigationProperties)
        //{
        //    IQueryable<T> items = _context.Set<T>();
        //    if (navigationProperties != null)
        //    {
        //        foreach (var navigationProperty in navigationProperties)
        //        {
        //            items = items.Include(navigationProperty);
        //        }
        //    }
        //    return items;
        //}

        public IQueryable<T> FindMultiple(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] navigationProperties)
        {
            IQueryable<T> items = _context.Set<T>();
            if (navigationProperties != null)
            {
                foreach (var navigationProperty in navigationProperties)
                {
                    items = items.Include(navigationProperty);
                }
            }
            return items.Where(predicate);
        }

        public void Add(T entity)
        {
            _context.Add(entity);
        }

        public void Update(T entity)
        {
            _context.Update(entity);
        }

        public void Remove(T entity)
        {
            _context.Set<T>().Remove(entity);
        }

        public void Remove(K id)
        {
            Remove(FindById(id));
        }

        public void RemoveMultiple(List<T> entities)
        {
            _context.Set<T>().RemoveRange(entities);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }

        public void Dispose()
        {
            if (_context != null)
            {
                _context.Dispose();
            }
        }
        public void SetModifierPageStatus(Page page, EntityState entityState)
        {
            _context.Entry(page).State = entityState;
        }
        public void SetModifierTripStatus(Trip trip, EntityState entityState)
        {
            _context.Entry(trip).State = entityState;
        }
        public void SetModifierUserStatus(User user, EntityState entityState)
        {
            _context.Entry(user).State = entityState;
        }
    }
}
/*
 * Entity Framework supports three ways to load related data - eager loading, lazy loading and explicit loading. 
 * The techniques shown in this topic apply equally to models created with Code First and the EF Designer.
 * ref: https://docs.microsoft.com/en-us/ef/ef6/querying/related-data
 */