using Data.Entities;
using Data.Interfaces;
using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using Domain.IServices;
using System;
using System.Collections.Generic;

namespace Domain.Services
{
    class ChatService : IChatService<Guid>
    {
        private readonly IRepository<ChatBox, Guid> m_ChatBoxRepository;
        public ChatService(IRepository<ChatBox, Guid> repository)
        {
            m_ChatBoxRepository = repository;
        }

        public ChatBoxResponse CreateOrUpdateChatBox(UpdateChatBoxRequest chatBoxRequest)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ChatBoxResponse> GetAllChatBoxesByUserId(Guid id)
        {
            throw new NotImplementedException();
        }

        public ChatBoxResponse GetChatBoxByChatBoxId(Guid id)
        {
            throw new NotImplementedException();
        }
    }
}
