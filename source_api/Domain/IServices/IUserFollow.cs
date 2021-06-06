using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.IServices
{
    public interface IUserFollow<T>
    {
        UserFollowPageResponse GetFollowById(Guid id);
        UserFollowPageResponse Follow(UserFollowPageRequest model);
        void UnFollow(UserUnfollowRequest userUnfollowRequest);
        bool GetFollow(UserFollowPageRequest userFollowRequest);
    }
}
