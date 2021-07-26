using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.ResponseModels
{
    public class MessengerResponse
    {
        public MessengerResponse() { }
        public MessengerResponse(Guid id, System.DateTime dateCreated, Guid fromId, Guid toId,
            string subject, string content, string attachment)
        {
            Id = id;
            FromId = fromId;
            ToId = toId;
            Subject = subject;
            Content = content;
            Attachment = attachment;
            DateCreated = dateCreated;
        }
        public Guid Id { get; set; }
        public Guid FromId { get; set; }
        public Guid ToId { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public string Attachment { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
