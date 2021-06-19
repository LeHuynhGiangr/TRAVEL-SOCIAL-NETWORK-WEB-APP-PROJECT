using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.ResponseModels
{
    public class AdvertisementResponse
    {
        public AdvertisementResponse() { }
        public AdvertisementResponse(Guid id, System.DateTime dateCreated, string name, string cost,
            int priority,DateTime endDate, bool active, string pageId)
        {
            Id = id;
            DateCreated = dateCreated;
            Name = name;
            Cost = cost;
            Priority = priority;
            EndDate = endDate;
            Active = active;
            PageId = pageId;
        }
        public Guid Id { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public string Name { get; set; }
        public string Cost { get; set; }
        public int Priority { get; set; }
        public DateTime EndDate { get; set; }
        public bool Active { get; set; }
        public string PageId { get; set; }
    }
}
