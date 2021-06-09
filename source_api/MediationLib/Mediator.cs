using System.Collections.Generic;
using System;
using System.Collections.Concurrent;
using System.Text.Json;

namespace MediationLib
{
    public static class Mediator
    {
        //private static Dictionary<Guid, Dictionary<object, Action<object>>> s_clients = new Dictionary<Guid, Dictionary<object, Action<object>>>();
        private static ConcurrentDictionary<Guid, Action<object>> s_clients = new ConcurrentDictionary<Guid, Action<object>>();

        #region Methods
        public static void Register(Guid guid, object threadId, Action<object> callbackFunc)
        {
            if (s_clients.ContainsKey(guid))
            {
                Action<object> callbackOnDel;
                s_clients.TryRemove(guid, out callbackOnDel);
            }

            s_clients.TryAdd(guid, callbackFunc);
            Console.WriteLine(guid.ToString());
            //if (s_clients[guid].ContainsKey(threadId))
            //{
            //    s_clients[guid].Remove(threadId);
            //}
            //s_clients[guid].Add(threadId, callbackFunc);


            Console.WriteLine("Current connected client");
            foreach (var item in s_clients)
            {
                Console.WriteLine("\tid: {0},", item.Key);
            }
            Console.WriteLine("");
        }

        public static void Notify(List<Guid> guids, object message)
        {
            //Notify to client
            foreach (Guid key in guids)
            {
                if (s_clients.ContainsKey(key))
                {
                    s_clients[key]?.Invoke(message);
                }
            }
        }

        public static void Notify(Guid guid, object message)
        {
            if (s_clients.ContainsKey(guid))
            {
                s_clients[guid]?.Invoke(message);
            }
        }

        public static void Notify(List<Guid> guids, string token, object message)
        {
            //Notify to client
            foreach (Guid key in guids)
            {
                var data = JsonSerializer.Serialize(new { token, message });

                if (s_clients.ContainsKey(key))
                {
                    s_clients[key]?.Invoke(message);
                }
            }
        }
        #endregion Methods
    }
}