using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.RequestModels
{
    public class MessengerRequest
    {
        public Guid FromId { get; set; }
        public Guid ToId { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public IFormFile Attachment { get; set; }
    }
}
