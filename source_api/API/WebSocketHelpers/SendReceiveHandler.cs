using Microsoft.AspNetCore.Http;
using System;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace API.WebSocketHelpers
{
    public class SendReceiveHandler
    {
        private byte[] dataBuffer = new byte[4096];
        private string threadId = null;
        private HttpContext context;
        private WebSocket webSocket;
        public SendReceiveHandler(HttpContext context, string threadId)
        {
            this.context = context;
            this.threadId = threadId;
        }
        public async Task Echo()
        {
            webSocket = await context.WebSockets.AcceptWebSocketAsync();
            WebSocketReceiveResult data = await webSocket.ReceiveAsync(new ArraySegment<byte>(dataBuffer), CancellationToken.None);
            if (!data.CloseStatus.HasValue)
            {
                string plainTxt = System.Text.Encoding.ASCII.GetString(dataBuffer, 0, data.Count);
                Mediator.Register(Guid.Parse(plainTxt), threadId, callbackFunc:Send);
                while (!data.CloseStatus.HasValue)
                {
                    await webSocket.SendAsync(new ArraySegment<byte>(dataBuffer, 0, data.Count), data.MessageType, data.EndOfMessage, CancellationToken.None);
                    data = await webSocket.ReceiveAsync(new ArraySegment<byte>(dataBuffer), CancellationToken.None);
                }
            }
            await webSocket.CloseAsync(data.CloseStatus.Value, data.CloseStatusDescription, CancellationToken.None);
        }

        public void Send(object obj)
        {
            byte[] message = System.Text.ASCIIEncoding.UTF8.GetBytes((string)obj);
            webSocket.SendAsync(new ArraySegment<byte>(message), WebSocketMessageType.Binary, true, CancellationToken.None);
        }
    }
}