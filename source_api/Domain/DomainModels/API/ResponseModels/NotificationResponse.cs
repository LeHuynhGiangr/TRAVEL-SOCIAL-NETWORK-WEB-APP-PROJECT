using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.ResponseModels
{
    public class NotificationResponse
    {
        public NotificationResponse() { }
        public NotificationResponse(Guid id, System.DateTime dateCreated, string description,string userId, string pageId)
        {
            Id = id;
            DateCreated = dateCreated;
            Description = description;
            UserId = userId;
            PageId = pageId;
        }

        public Guid Id { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
        public string UserId { get; set; }
        public string PageId { get; set; }
    }
}
