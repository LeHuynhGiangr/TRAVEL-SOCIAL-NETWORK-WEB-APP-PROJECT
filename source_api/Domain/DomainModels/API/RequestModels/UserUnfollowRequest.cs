using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.RequestModels
{
    public class UserUnfollowRequest
    {
        public Guid PageId { get; set; }
        public Guid UserId { get; set; }

    }
}
