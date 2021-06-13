using Domain.DomainModels.API.RequestModels;
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
        DiscountResponse CreateDiscount(DiscountRequest model);
        bool BlockDiscount(Guid id);
        void DeleteDiscount(Guid id);
    }
}
