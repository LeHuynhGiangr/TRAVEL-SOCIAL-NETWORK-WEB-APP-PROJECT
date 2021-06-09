using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.RequestModels
{
    public class NotificationRequest
    {
        public string Description { get; set; }
        public Guid UserId { get; set; }
        public Guid PageId { get; set; }
    }
}
