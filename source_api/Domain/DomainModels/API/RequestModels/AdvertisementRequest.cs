using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.RequestModels
{
    public class AdvertisementRequest
    {
        public string Name { get; set; }
        public string Cost { get; set; }
        public int Priority { get; set; }
        public string EndDate { get; set; }
        public bool Active { get; set; }
        public Guid PageId { get; set; }
    }
}
