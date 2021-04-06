using Data.Interfaces;
using System;


namespace Data.Entities
{
    public class ReviewPage : IEntity<Guid>, IDateTracking
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public bool Active { get; set; }
        public int Rating { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public User User { get; set; }
        public Page Page { get; set; }
    }
}
