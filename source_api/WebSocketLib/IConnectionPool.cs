using System.Collections.Generic;
using System.Net.WebSockets;

namespace WebSocketLib
{
    interface IConnectionPool<T>
    {
        bool AddNewConnect();
        bool DeleteConnection();
        bool IsConnect(T id);
        bool SendTo(T id, object data);
        object Serialization(object o);
        object Deserialization(object o);
    }
}
