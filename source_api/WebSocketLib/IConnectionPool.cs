using System;
using System.Collections.Generic;
using System.Net.WebSockets;

namespace WebSocketLib
{
    public interface IConnectionPool<T>
    {
        void Register(T key, Action<object> callbackFunc);
        void Notify(List<T> keysLst, object data);
    }
}
