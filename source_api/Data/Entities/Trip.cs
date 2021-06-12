using Data.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Entities
{
    public class Trip : IEntity<Guid>, IDateTracking
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }
        public string Description { get; set; }
        public float Location { get; set; }
        public string Image { get; set; }
        public string Cost { get; set; }
        public string Persons { get; set; }
        public string Start { get; set; }
        public string Destination { get; set; }
        public string Service { get; set; }
        public string Policy { get; set; }
        public string InfoContact { get; set; }
        public bool Active { get; set; }
        public double Priority { get; set; }
        public double PassengerInvite { get; set; }
        public DateTime? DateStart { get; set; }
        public DateTime? DateEnd { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        [ForeignKey("PageId")]
        public Guid PageId { get; set; }
        public Page Page { get; set; }
        public IList<UserJoinTrip> UserJoinTrips { get; set; }
    }
}
