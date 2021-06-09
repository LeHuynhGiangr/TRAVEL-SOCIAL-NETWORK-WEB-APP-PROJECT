using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.IServices
{
    public interface INotificationService<T>
    {
        NotificationResponse GetById(Guid id);
        NotificationResponse GetNewNotification(Guid id);
        IEnumerable<NotificationResponse> GetNotificationByUserId<IdType>(IdType id);
        NotificationResponse CreateNotification(NotificationRequest model);
    }
}
