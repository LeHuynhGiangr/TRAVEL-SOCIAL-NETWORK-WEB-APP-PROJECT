using System;
using System.Collections.Generic;

namespace API
{
    public class Mediator
    {
        private static Dictionary<Guid, Dictionary<object, Action<object>>> s_clients = new Dictionary<Guid, Dictionary<object, Action<object>>>();

        #region Methods
        public static void Register(Guid guid, object threadId, Action<object> callbackFunc)
        {
            if (!s_clients.ContainsKey(guid))
            {
                s_clients.Add(guid, new Dictionary<object, Action<object>>());
            }
            if (s_clients[guid].ContainsKey(threadId))
            {
                s_clients[guid].Remove(threadId);
            }
            s_clients[guid].Add(threadId, callbackFunc);
        }
        public static void Notify(List<Guid> guids, object message)
        {
            //Notify to client
            foreach(Guid key in guids)
            {
                foreach(var item in s_clients[key])
                {
                    item.Value?.Invoke(message);
                }
            }
        }
        #endregion Methods
    }
}
