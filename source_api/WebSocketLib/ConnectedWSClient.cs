using System;
using System.Net.WebSockets;

namespace WebSocketLib
{
    public delegate void SentEventHandler(object sender, EventArgs eventArgs);
    public delegate void ReceivedEventHandler(object sender, EventArgs eventArgs);
    public class ConnectedWSClient
    {
        private WebSocket webSocket;
        private byte[] databuffer;

        #region Properties
        public WebSocket WebSocket { get; set; }
        public event SentEventHandler OnSent;
        public event ReceivedEventHandler OnReceived;
        #endregion Properties

        #region Methods
        public bool IsSynchronize()
        {
            return default(bool);
        }
        public bool IsDisconnected()
        {
            return default(bool);
        }
        public int Send()
        {
            OnSent?.Invoke(this, new EventArgs());
            return 0;
        }
        public int Receive()
        {
            OnReceived?.Invoke(this, new EventArgs());
            return 0;
        }
        #endregion Methods
    }
}
