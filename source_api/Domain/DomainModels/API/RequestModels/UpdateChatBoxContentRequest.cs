namespace Domain.DomainModels.API.RequestModels
{
    public class UpdateChatBoxContentRequest
    {
        public string ChatBoxId { get; set; }
        public string UserId { get; set; }
        public double OLEAD { get; set; }
        public string Message { get; set; }
    }
}
