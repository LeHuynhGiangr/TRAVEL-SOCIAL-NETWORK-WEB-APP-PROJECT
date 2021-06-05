using Data.Interfaces;
using System;

namespace Data.Entities
{
    public class Notification : IEntity<Guid>, IDateTracking
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public Guid PageId { get; set; }
        public Page Page { get; set; }
    }
}
