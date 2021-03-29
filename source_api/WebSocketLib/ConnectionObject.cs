using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.WebSockets;

namespace WebSocketLib
{
    class ConnectionObject :Dictionary<Guid, WebSocket>
    {
    }
}
