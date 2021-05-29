using System;
using System.Runtime.Serialization;

namespace Domain.DTO
{
    [DataContract]
    class MessageUnitDC
    {
        public MessageUnitDC(string id, string mess, double dateTime)
        {
            Id = id ?? Guid.NewGuid().ToString();
            Message = mess ?? "";
            OLEAD = dateTime > 0 ? dateTime : DateTime.UtcNow.ToOADate();
        }
        [DataMember]
        public string Id { get; set; }
        [DataMember]
        public string Message { get; set; }
        [DataMember]
        public double OLEAD { get; set; }
    }
}
