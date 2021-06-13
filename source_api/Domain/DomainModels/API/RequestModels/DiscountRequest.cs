using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.RequestModels
{
    public class DiscountRequest
    {
        public string Name { get; set; }
        public string CodeDiscount { get; set; }
        public int DiscountPer { get; set; }
        public bool Active { get; set; }
        public Guid PageId { get; set; }
    }
}
