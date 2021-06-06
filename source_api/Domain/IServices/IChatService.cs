using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using System.Collections.Generic;

namespace Domain.IServices
{
    public interface IChatService<Guid>
    {
        IEnumerable<ChatBoxResponse> GetAllChatBoxesByUserId(Guid id);
        ChatBoxResponse GetChatBox(Guid id);
        ChatBoxResponse GetChatBox(Guid id, Guid theOtherId);
        UpdateChatBoxContentResponse UpdateChatBoxContent(UpdateChatBoxContentRequest chatBoxRequest);
        UpdateChatBoxContentResponse LoadCachedChatBoxContent(Guid userId, Guid chatBoxId);
    }
}
