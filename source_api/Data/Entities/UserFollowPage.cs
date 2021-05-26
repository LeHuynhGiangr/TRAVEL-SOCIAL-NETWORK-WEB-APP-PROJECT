using Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Entities
{
    public class UserFollowPage : IEntity<Guid>, IDateTracking
    {
        public Guid Id { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public Guid PageId { get; set; }
        public Page Page { get; set; }

    }
}
