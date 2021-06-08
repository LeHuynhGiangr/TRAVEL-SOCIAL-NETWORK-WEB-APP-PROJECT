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
    public class NotificationService : INotificationService<Guid>
    {
        private readonly EFRepository<Notification, Guid> m_notiRepository;
        public NotificationService(EFRepository<Notification, Guid> notiRepository)
        {
            m_notiRepository = notiRepository;
        }
        IEnumerable<NotificationResponse> INotificationService<Guid>.GetNotificationByUserId<IdType>(IdType id)
        {
            var l_noti = m_notiRepository.FindMultiple(_ => _.User.Id.Equals(id), _ => _.User, _ => _.Page);

            List<NotificationResponse> l_notiResponses = new List<NotificationResponse>();

            foreach (Notification noti in l_noti)
            {
                l_notiResponses.Add(
                    new NotificationResponse(
                        noti.Id,
                        noti.DateCreated,
                        noti.Description,
                        noti.Page.Id.ToString(),
                        noti.User.Id.ToString()));
            }
            return l_notiResponses;
        }
        public NotificationResponse GetById(Guid id)
        {
            var noti = m_notiRepository.FindSingle(_ => _.Id.Equals(id), _ => _.User, _ => _.Page);
            NotificationResponse notiResponse = new NotificationResponse(
                        noti.Id,
                        noti.DateCreated,
                        noti.Description,
                        noti.User.Id.ToString(),
                        noti.PageId.ToString());
            return notiResponse;
        }
        public NotificationResponse GetNewNotification(Guid id)
        {
            var noti = m_notiRepository.FindMultiple(_ => _.User.Id.Equals(id), _ => _.User, _ => _.Page).OrderByDescending(_ => _.DateCreated).First();
            NotificationResponse notiResponse = new NotificationResponse(
                        noti.Id,
                        noti.DateCreated,
                        noti.Description,
                        noti.User.Id.ToString(),
                        noti.PageId.ToString());
            return notiResponse;
        }
        public NotificationResponse CreateNotification(NotificationRequest model)
        {
            try
            {
                Guid l_newTripGuidId = Guid.NewGuid();
                Notification o_newNoti = new Notification
                {
                    Id = l_newTripGuidId,
                    Description = model.Description,
                    DateCreated = DateTime.Now,
                    UserId = model.UserId,
                    PageId = model.PageId
                };

                m_notiRepository.Add(o_newNoti);
                m_notiRepository.SaveChanges();

                return GetById(l_newTripGuidId);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
