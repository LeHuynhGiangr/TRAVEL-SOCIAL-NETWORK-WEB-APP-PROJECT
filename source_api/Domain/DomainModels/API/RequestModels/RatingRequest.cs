using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.RequestModels
{
    public class RatingRequest
    {
        public string Content { get; set; }
        public bool Active { get; set; }
        public int Rating { get; set; }
        public Guid UserId { get; set; }
        public Guid PageId { get; set; }
    }
}
