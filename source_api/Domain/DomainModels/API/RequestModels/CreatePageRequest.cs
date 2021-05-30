using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.RequestModels
{
    public class CreatePageRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public double Follow { get; set; }
        public bool Active { get; set; }
        public Guid UserId { get; set; }
    }
}
