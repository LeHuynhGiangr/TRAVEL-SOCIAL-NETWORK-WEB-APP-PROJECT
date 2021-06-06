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
    public class ChatService : IChatService<Guid>
    {
        //private readonly IRepository<User, Guid> m_UserRepository;
        private readonly IRepository<ChatBox, Guid> m_ChatBoxRepository;
        private readonly IRepository<UserChatBox, Guid> m_UserChatBoxRepository;

        public ChatService(IRepository<ChatBox, Guid> chatBoxRepo, IRepository<UserChatBox, Guid> userChatBoxRepo)
        {
            //m_UserRepository = userRepo;
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
                throw new Exception("can not update chatbox content");
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

        public ChatBoxResponse GetChatBox(Guid id)
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
            var l_userChatBox = m_UserChatBoxRepository.FindSingle(p => p.UserId == id && p.TheOtherId == theOtherId, p => p.ChatBox);

            if (l_userChatBox == null)
            {
                var l_chatBox = new ChatBox();
                l_chatBox.Id = Guid.NewGuid();
                l_chatBox.MemberMetadataJson = "[]";
                l_chatBox.ChatContentJson = "[]";

                l_userChatBox = new UserChatBox();
                l_userChatBox.Id = Guid.NewGuid();
                l_userChatBox.UserId = id;
                l_userChatBox.TheOtherId = theOtherId;
                l_userChatBox.ChatBoxId = l_chatBox.Id;
                l_userChatBox.ContentCacheJson = "[]";

                l_userChatBox.ChatBox = l_chatBox;

                m_UserChatBoxRepository.Add(l_userChatBox);
                m_UserChatBoxRepository.SaveChanges();
            }

            var chatBox = l_userChatBox.ChatBox;
            var chatBoxResponse = new ChatBoxResponse(chatBox.Id.ToString(), chatBox.MemberMetadataJson, chatBox.ChatContentJson);

            return chatBoxResponse;
        }

        public UpdateChatBoxContentResponse LoadCachedChatBoxContent(Guid userId, Guid chatBoxId)
        {
            UserChatBox l_userChatBox;
            string l_cachedContentJson;

            l_userChatBox = m_UserChatBoxRepository.FindSingle(p => p.UserId == userId && p.ChatBoxId == chatBoxId);

            if (l_userChatBox == null)
            {
                throw new Exception("record is not found");
            }

            try
            {
                l_cachedContentJson = l_userChatBox.ContentCacheJson.Clone().ToString();
                l_userChatBox.ContentCacheJson = "[]";

                m_UserChatBoxRepository.Update(l_userChatBox);
                m_ChatBoxRepository.SaveChanges();
                return new UpdateChatBoxContentResponse(l_userChatBox.Id.ToString(), l_cachedContentJson);
            }
            catch (Exception e)
            {
                Console.WriteLine("Domain/Services/ChatService.cs (LoadCachedChatBoxContent): Something's wrong: " + e.StackTrace);
                throw new Exception("Can not load cached chatbox content");
            }
        }
    }
}
