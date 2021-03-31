using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.WebSockets;

namespace WebSocketLib
{
    class ConnectionObject :Dictionary<Guid, WebSocket>
    {
        private WebSocket webSocket;
        public WebSocket WebSocket { get; set; }
        bool IsSynchronize()
        {
            return default(bool);
        }
        bool IsDisconnected()
        {
            return default(bool);
        }
    }
}
