using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.IServices
{
    public interface IAdvertisementService<T>
    {
        IEnumerable<AdvertisementResponse> GetAll();
        AdvertisementResponse GetById(Guid id);
        IEnumerable<AdvertisementResponse> GetAdsByPageId<IdType>(IdType id);
        AdvertisementResponse CreateAdvertisement(AdvertisementRequest model);
        void DeleteAdvertisement(Guid id);
    }
}
