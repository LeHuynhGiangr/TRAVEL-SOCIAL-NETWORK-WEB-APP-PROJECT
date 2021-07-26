using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.IServices
{
    public interface IMessageService<T>
    {
        IEnumerable<MessengerResponse> GetMesByUserId<IdType>(IdType iduser, IdType idclient);
        string Create(MessengerRequest model, string webRootPath);
        void DeleteMessages(Guid iduser, Guid idclient);
        void DeleteMessagesById(Guid id);
    }
}
