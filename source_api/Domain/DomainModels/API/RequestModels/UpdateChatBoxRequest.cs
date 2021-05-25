namespace Domain.DomainModels.API.RequestModels
{
    public class UpdateChatBoxRequest
    {
        public string ChatBoxId { get; set; }
        public object UserIdsJson { get; set; }
        public object ChatJson { get; set; }
    }
}
