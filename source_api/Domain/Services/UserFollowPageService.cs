using Data.EF;
using Data.Entities;
using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using Domain.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Domain.Services
{
    public class UserFollowPageService : IUserFollow<Guid>
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
        public bool GetFollow(UserFollowPageRequest userFollowRequest)
        {
            var l_trips = m_upageRepository.GetAll(_ => _.Page, _ => _.User).Where(_ => _.PageId.ToString().ToLower().Contains(userFollowRequest.PageId.ToString().ToLower())
                    && _.UserId.ToString().ToLower().Contains(userFollowRequest.UserId.ToString().ToLower())).FirstOrDefault();
            if (l_trips != null)
                return true;
            else
                return false;

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
                throw new Exception("follow failed");
            }
        }
        public void UnFollow(UserUnfollowRequest userUnfollowRequest)
        {
            try
            {
                var l_trips = m_upageRepository.GetAll(_ => _.Page, _ => _.User).Where(_ => _.PageId.ToString().ToLower().Contains(userUnfollowRequest.PageId.ToString().ToLower())
                 && _.UserId.ToString().ToLower().Contains(userUnfollowRequest.UserId.ToString().ToLower())).FirstOrDefault();
                m_upageRepository.Remove(l_trips);
                m_upageRepository.SaveChanges();
            }
            catch
            {
                throw new Exception("delete failed");
            }
        }
    }
}
