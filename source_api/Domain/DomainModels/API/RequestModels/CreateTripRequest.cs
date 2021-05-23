using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.RequestModels
{
    public class CreateTripRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Start { get; set; }
        public string Destination { get; set; }
        public string Service { get; set; }
        public string Policy { get; set; }
        public string InfoContact { get; set; }
        public string Content { get; set; }
        public bool Active { get; set; }
        public string Cost { get; set; }
        public string Persons { get; set; }
        public string DateStart { get; set; }
        public string DateEnd { get; set; }
        public IFormFile Image { get; set; }
        public float Location { get; set; }
        public Guid UserId { get; set; }
        public Guid PageId { get; set; }
    }
}
