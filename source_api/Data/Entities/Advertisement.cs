using Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Entities
{
    public class Advertisement : IEntity<Guid>, IDateTracking
    {
        public Guid Id { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public string Name { get; set; }
        public string Cost { get; set; }
        public int Priority { get; set; }
        public DateTime EndDate { get; set; }
        public bool Active { get; set; }
        public Guid PageId { get; set; }
        public Page Page { get; set; }

    }
}
