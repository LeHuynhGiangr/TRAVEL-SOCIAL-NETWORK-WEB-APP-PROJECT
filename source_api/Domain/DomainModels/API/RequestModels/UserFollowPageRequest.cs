using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.RequestModels
{
    public class UserFollowPageRequest
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid PageId { get; set; }
    }
}
