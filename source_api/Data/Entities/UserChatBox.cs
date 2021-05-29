using Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Entities
{
    public class UserChatBox : IEntity<Guid>
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }
        public Guid TheOtherId { get; set; }
        public Guid ChatBoxId { get; set; }
        public string ContentCacheJson { get; set; }

        public virtual User User { get; set; }
        public virtual User TheOther { get; set; }
        public virtual ChatBox ChatBox { get; set; }
    }
}
