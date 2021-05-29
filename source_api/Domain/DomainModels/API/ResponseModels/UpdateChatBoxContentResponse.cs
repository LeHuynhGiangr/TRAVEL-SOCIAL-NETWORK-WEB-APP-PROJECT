namespace Domain.DomainModels.API.ResponseModels
{
    public class UpdateChatBoxContentResponse
    {
        public UpdateChatBoxContentResponse(string chatBoxId, string updatedContentJson, string memberMetaDataJson = "")
        {
            ChatBoxId = chatBoxId;
            //MemberMetaDataJson = memberMetaDataJson;
            UpdatedContentJson = updatedContentJson;
        }
        public string ChatBoxId { get; set; }
        //public string MemberMetaDataJson { get; set; }
        public string UpdatedContentJson { get; set; }
    }
}
