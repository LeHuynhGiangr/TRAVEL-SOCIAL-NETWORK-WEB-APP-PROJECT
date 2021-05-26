using Data.EF;
using Data.Entities;
using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Services
{
    public class UserFollowPageService
    {
        private readonly EFRepository<UserFollowPage, Guid> m_upageRepository;
        public UserFollowPageService(EFRepository<UserFollowPage, Guid> upageRepository)
        {
            m_upageRepository = upageRepository;
        }
        public UserFollowPageResponse GetFollowById(Guid id)
        {
            var upage = m_upageRepository.FindSingle(_ => _.Id.Equals(id), _ => _.User, _ => _.Page);
            UserFollowPageResponse upageResponse = new UserFollowPageResponse(
                        upage.Id,
                        upage.DateCreated,
                        upage.UserId.ToString(),
                        upage.PageId.ToString());
            return upageResponse;
        }
        public UserFollowPageResponse Follow(UserFollowPageRequest model)
        {
            try
            {
                Guid l_newGuidId = Guid.NewGuid();
                //Post l_newPost = new Post(l_newPostGuidId, model.Status, System.Text.Encoding.ASCII.GetBytes(model.Base64Str), System.Guid.Parse(model.UserId));
                UserFollowPage l_ufp = new UserFollowPage
                {
                    Id = l_newGuidId,
                    DateCreated = DateTime.Now,
                    UserId = model.UserId,
                    PageId = model.PageId
                };

                m_upageRepository.Add(l_ufp);
                m_upageRepository.SaveChanges();

                return GetFollowById(l_newGuidId);
            }
            catch
            {
                throw new Exception("create trip failed");
            }
        }
    }
}
