using Data.Interfaces;
using System;
using System.Collections.Generic;

namespace Data.Entities
{
    public class Page : IEntity<Guid>, IDateTracking
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Avatar { get; set; }
        public string Background { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Description { get; set; }
        public double Follow { get; set; }
        public bool Active { get; set; }
        public string FImageCard { get; set; }
        public string BImageCard { get; set; }
        public bool RequestCreate { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public IList<Trip> Trips { get; set; }
        public IList<ReviewPage> ReviewPages { get; set; }
        public IList<UserFollowPage> UserFollowPages { get; set; }
        public IList<Notification> NotificationPages { get; set; }
        public IList<Discount> Discounts { get; set; }
        public IList<Advertisement> Advertisements { get; set; }
        public PageType PageType { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
    }
}
