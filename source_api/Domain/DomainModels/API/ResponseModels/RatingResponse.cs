using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.ResponseModels
{
    public class RatingResponse
    {
        public RatingResponse() { }
        public RatingResponse(Guid id, System.DateTime dateCreated, string content, int rating, bool active, string userId, string pageId)
        {
            Id = id;
            DateCreated = dateCreated;
            Content = content;
            Rating = rating;
            Active = active;
            UserId = userId;
            PageId = pageId;
        }

        public Guid Id { get; set; }
        public string Content { get; set; }
        public int Rating { get; set; }
        public bool Active { get; set; }
        public DateTime DateCreated { get; set; }
        public string UserId { get; set; }
        public string PageId { get; set; }
    }
}
