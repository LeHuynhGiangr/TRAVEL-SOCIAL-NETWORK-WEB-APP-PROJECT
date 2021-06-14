using Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Entities
{
    public class Discount : IEntity<Guid>, IDateTracking
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string CodeDiscount { get; set; }
        public int DiscountPer { get; set; }
        public bool Active { get; set; }
        public int LimitPassenger { get; set; }
        public double LimitCost { get; set; }
        public IList<UserJoinTrip> UserJoinTrips { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateExpired { get; set; }
        public DateTime? DateModified { get; set; }
        public Guid PageId { get; set; }
        public Page Page { get; set; }
    }
}
