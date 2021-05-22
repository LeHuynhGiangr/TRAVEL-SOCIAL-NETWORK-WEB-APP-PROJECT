using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.IServices
{
    public interface IRatingService<T>
    {
        RatingResponse AddRating(RatingRequest model);
        bool BlockRating(Guid id);
        IEnumerable<RatingResponse> GetRatingsByPageId<IdType>(IdType id);
    }
}
