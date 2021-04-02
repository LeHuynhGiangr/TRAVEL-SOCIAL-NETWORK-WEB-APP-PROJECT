using System;
using System.Net.WebSockets;

namespace WebSocketLib
{
    delegate void SentEventHandler(object sender, EventArgs eventArgs);
    delegate void ReceivedEventHandler(object sender, EventArgs eventArgs);
    class ConnectionObject
    {
        private WebSocket webSocket;
        private byte[] databuffer;

        #region Properties
        public WebSocket WebSocket { get; set; }
        public event SentEventHandler OnSent;
        public event ReceivedEventHandler OnReceived;
        #endregion Properties

        #region Methods
        bool IsSynchronize()
        {
            return default(bool);
        }
        bool IsDisconnected()
        {
            return default(bool);
        }
        int Send()
        {
            OnSent?.Invoke(this, new EventArgs());
            return 0;
        }
        int Receive()
        {
            OnReceived?.Invoke(this, new EventArgs());
            return 0;
        }
        #endregion Methods
    }
}
