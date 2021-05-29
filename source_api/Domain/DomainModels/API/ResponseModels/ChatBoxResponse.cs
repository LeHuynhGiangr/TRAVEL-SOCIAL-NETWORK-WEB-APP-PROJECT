using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.ResponseModels
{
    public class ChatBoxResponse
    {
        public ChatBoxResponse(string chatBoxId, string memberMetadataJson, string chatContentJson)
        {
            ChatBoxId = chatBoxId;
            MemberMetadataJson = memberMetadataJson;
            ChatContentJson = chatContentJson;
        }

        public string ChatBoxId { get; set; }
        public string MemberMetadataJson { get; set; }
        public string ChatContentJson { get; set; }
    }
}
