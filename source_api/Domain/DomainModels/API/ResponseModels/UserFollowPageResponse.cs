using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.ResponseModels
{
    public class UserFollowPageResponse
    {
        public UserFollowPageResponse(Guid id, DateTime dateCreated, string userid, string pageid)
        {
            Id = id;
            DateCreated = dateCreated;
            UserId = userid;
            PageId = pageid;
        }

        public Guid Id { get; set; }
        public DateTime DateCreated { get; set; }
        public string UserId { get; set; }
        public string PageId { get; set; }
    }
}
