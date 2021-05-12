using Domain.DomainModels.API.ResponseModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.IServices
{
    public interface IFriendService<T>
    {
        IEnumerable<FriendResponse> GetAll();
        FriendResponse GetById(T id);
        //UserResponse Create(CreateRequest model);
        //UserResponse Update(T id, UpdateUserRequest model);
        bool Delete(T id);

        List<Guid> GetAllKeyById(Guid id);
    }
}
