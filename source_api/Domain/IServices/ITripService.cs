using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Domain.IServices
{
    public interface ITripService<T>
    {
        IEnumerable<TripResponse> GetAll();
        IEnumerable<TripResponse> GetTripsByUserId<IdType>(IdType id);
        IEnumerable<TripResponse> GetTripsByPageId<IdType>(IdType id);
        IEnumerable<TripResponse> FilterTrip(FilterRequest filterRequest);
        TripResponse GetById(T id);
        TripResponse Create(CreateTripRequest model, string webRootPath);
        //UserResponse Update(T id, UpdateUserRequest model);
        bool Delete(T id);
        void DeleteByUserId(Guid id);
    }
}
