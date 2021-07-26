using Data.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Data.Entities
{
    public class Messenger : IEntity<Guid>, IDateTracking
    {
        public Guid Id { get; set; }
        [ForeignKey("FromId"), Column(Order = 0)]
        public Guid FromId { get; set; }
        public User UserFrom { get; set; }
        [ForeignKey("ToId"), Column(Order = 1)]
        public Guid ToId { get; set; }
        public User UserTo { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public string Attachment { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
    }
}
