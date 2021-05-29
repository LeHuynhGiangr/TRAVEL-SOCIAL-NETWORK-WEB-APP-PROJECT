using Data.Entities;
using Data.Interfaces;
using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using Domain.DTO;
using Domain.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace Domain.Services
{
    class ChatService : IChatService<Guid>
    {
        private readonly IRepository<User, Guid> m_UserRepository;
        private readonly IRepository<ChatBox, Guid> m_ChatBoxRepository;
        private readonly IRepository<UserChatBox, Guid> m_UserChatBoxRepository;

        public ChatService(IRepository<User, Guid> userRepo, IRepository<ChatBox, Guid> chatBoxRepo, IRepository<UserChatBox, Guid> userChatBoxRepo)
        {
            m_UserRepository = userRepo;
            m_ChatBoxRepository = chatBoxRepo;
            m_UserChatBoxRepository = userChatBoxRepo;
        }

        public UpdateChatBoxContentResponse UpdateChatBoxContent(UpdateChatBoxContentRequest request)
        {
            ChatBox l_updatedChatBox;
            string l_cachedContentJson;
            MessageUnitDC l_messObj = new MessageUnitDC(request.UserId, request.Message, request.OLEAD);
            string messJsonStr = JsonSerializer.Serialize(l_messObj);

            try
            {
                l_updatedChatBox = m_ChatBoxRepository.FindById(Guid.Parse(request.ChatBoxId), p => p.UserChatBoxes);
                if (l_updatedChatBox == null)
                {
                    throw new Exception("record is not found");
                }

                l_updatedChatBox.ChatContentJson.Insert(l_updatedChatBox.ChatContentJson.Length - 1, "," + messJsonStr);

                foreach (var userChatBox in l_updatedChatBox.UserChatBoxes)
                {
                    userChatBox.ContentCacheJson.Insert(userChatBox.ContentCacheJson.Length - 1, "," + messJsonStr);
                }

                var l_updatedUserChatBox = l_updatedChatBox.UserChatBoxes.FirstOrDefault(p => p.UserId.ToString() == request.UserId && p.ChatBoxId.ToString() == request.ChatBoxId);
                l_cachedContentJson = l_updatedUserChatBox.ContentCacheJson.Clone().ToString();
                l_updatedUserChatBox.ContentCacheJson = "[]";

                m_ChatBoxRepository.Update(l_updatedChatBox);
                m_ChatBoxRepository.SaveChanges();
                return new UpdateChatBoxContentResponse(l_updatedChatBox.Id.ToString(), l_cachedContentJson);
            }
            catch (Exception e)
            {
                Console.WriteLine("Domain/Services/ChatService.cs (UpdateChatBoxContent): Something's wrong: " + e.StackTrace);
                throw new Exception("can not update chatbox content: " + e.StackTrace);
            }
        }

        public IEnumerable<ChatBoxResponse> GetAllChatBoxesByUserId(Guid id)
        {
            var userChatBoxes = m_UserChatBoxRepository.FindMultiple(p => p.UserId == id, p => p.ChatBox);

            if (userChatBoxes == null)
            {
                throw new Exception("record is not found");
            }

            var chatBoxes = userChatBoxes.Select(p => p.ChatBox);

            var chatBoxesResponse = new List<ChatBoxResponse>();
            foreach (var chatBox in chatBoxes)
            {
                var chatBoxResponse = new ChatBoxResponse(chatBox.Id.ToString(), chatBox.MemberMetadataJson, chatBox.ChatContentJson);
                chatBoxesResponse.Add(chatBoxResponse);
            }

            return chatBoxesResponse;
        }

        public ChatBoxResponse GetChatBoxByChatBoxId(Guid id)
        {
            var chatBox = m_ChatBoxRepository.FindById(id);

            if (chatBox == null)
            {
                throw new Exception("record is not found");
            }

            var chatBoxResponse = new ChatBoxResponse(chatBox.Id.ToString(), chatBox.MemberMetadataJson, chatBox.ChatContentJson);

            return chatBoxResponse;
        }

        public ChatBoxResponse GetChatBox(Guid id, Guid theOtherId)
        {
            var userChatBox = m_UserChatBoxRepository.FindSingle(p => p.UserId == id && p.TheOtherId == theOtherId, p => p.ChatBox);

            if (userChatBox == null || userChatBox.ChatBox == null)
            {
                throw new Exception("record is not found");
            }

            var chatBox = userChatBox.ChatBox;
            var chatBoxResponse = new ChatBoxResponse(chatBox.Id.ToString(), chatBox.MemberMetadataJson, chatBox.ChatContentJson);

            return chatBoxResponse;
        }
    }
}
