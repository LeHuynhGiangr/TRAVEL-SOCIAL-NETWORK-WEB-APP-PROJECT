using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.ResponseModels
{
    public class TripResponse
    {
        public TripResponse() { }
        public TripResponse(Guid id, DateTime dateCreated, string description, string authorId, string image, string name,
            string start,string destination,string service,string policy,string infocontact,string content,string cost,
            string days, DateTime? datestart, DateTime? dateend, string pageid)
        {
            Id = id;
            DateCreated = dateCreated;
            Description = description;
            AuthorId = authorId;
            Image = image;
            Name = name;
            Start = start;
            Destination = destination;
            Service = service;
            Policy = policy;
            InfoContact = infocontact;
            Content = content;
            Cost = cost;
            Days = days;
            DateStart = datestart;
            DateEnd = dateend;
            PageId = pageid;
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public float Location { get; set; }
        public string Image { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public string Start { get; set; }
        public string Destination { get; set; }
        public string Service { get; set; }
        public string Policy { get; set; }
        public string InfoContact { get; set; }
        public string Content { get; set; }
        public string Cost { get; set; }
        public string Days { get; set; }
        public DateTime? DateStart { get; set; }
        public DateTime? DateEnd { get; set; }
        public string AuthorId { get; set; }
        public string PageId { get; set; }
    }
}
