using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.ResponseModels
{
    public class PageResponse
    {
        public PageResponse() { }
        public PageResponse(Guid id, System.DateTime dateCreated, string name,string address,string phonenumber, string avatar, string background, string description,double follow,bool active,string userId)
        {
            Id = id;
            DateCreated = dateCreated;
            Name = name;
            Address = address;
            PhoneNumber = phonenumber;
            Avatar = avatar;
            Background = background;
            Description = description;
            Follow = follow;
            Active = active;
            UserId = userId;
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Avatar { get; set; }
        public double Follow { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Background { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public bool Active { get; set; }
        public string UserId { get; set; }
    }
}
