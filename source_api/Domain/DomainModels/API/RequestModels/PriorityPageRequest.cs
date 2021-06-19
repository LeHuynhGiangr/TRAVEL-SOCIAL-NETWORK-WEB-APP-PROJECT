using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.RequestModels
{
    public class PriorityPageRequest
    {
        public Guid Id { get; set; }
        public int Priority { get; set; }
    }
}
