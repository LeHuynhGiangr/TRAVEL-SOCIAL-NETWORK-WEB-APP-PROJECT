using Data.Interfaces;
using System;
using System.Collections.Generic;

namespace Data.Entities
{
    public class ChatBox : IEntity<Guid>, IDateTracking
    {
        public Guid Id {get; set; }

        public string MemberMetadataJson { get; set; } = "[]";

        public string ChatContentJson { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }  

        public virtual ICollection<UserChatBox> UserChatBoxes { get; set; }
    }
}
