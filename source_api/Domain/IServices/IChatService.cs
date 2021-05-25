using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using System.Collections.Generic;

namespace Domain.IServices
{
    public interface IChatService<Guid>
    {
        IEnumerable<ChatBoxResponse> GetAllChatBoxesByUserId(Guid id);
        ChatBoxResponse GetChatBoxByChatBoxId(Guid id);

        ChatBoxResponse CreateOrUpdateChatBox(UpdateChatBoxRequest chatBoxRequest);
    }
}
