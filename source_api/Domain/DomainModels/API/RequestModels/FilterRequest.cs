using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.RequestModels
{
    public class FilterRequest
    {
        public string Name { get; set; }
        public int CostStart { get; set; }
        public int CostEnd { get; set; }
    }
}
