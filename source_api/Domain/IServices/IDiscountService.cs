using Domain.DomainModels.API.ResponseModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.IServices
{
    public interface IDiscountService<T>
    {
        IEnumerable<DiscountResponse> GetAll();
        DiscountResponse GetById(Guid id);
        IEnumerable<DiscountResponse> GetDiscountByPageId<IdType>(IdType id);
    }
}
