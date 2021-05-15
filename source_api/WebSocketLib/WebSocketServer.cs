using System.Net.Sockets;
using System.Net;
using System;
using System.Threading;

namespace WebSocketLib
{
    public class WebSocketServer
    {
        //private Dictionary<object, TcpClient> _WsClientDic = new Dictionary<object, TcpClient>();
        private string _IpAddress;
        private int _Port;
        private TcpListener _Server;

        public WebSocketServer(string ipAddress, int port)
        {
            _Server = new TcpListener(IPAddress.Parse(ipAddress), port);
            _IpAddress = ipAddress;
            _Port = port;
        }

        public void StartServer()
        {
            _Server.Start();
            Console.WriteLine("Server has started: {0}:{1}", _IpAddress, _Port);

            Thread thread = new Thread(AcceptConnet);
            thread.IsBackground = true;
            thread.Start();
        }

        public void AcceptConnet()
        {
            int i = 0;
            while (true)
            {
                try
                {
                    TcpClient client = _Server.AcceptTcpClient();
                    Console.WriteLine("Establish connection with {0}", i++);
                    WebSocketClient newWsClient = new WebSocketClient(client);
                    newWsClient.Start();
                }
                catch(Exception e)
                {
                    Console.WriteLine("Exception from WebSocketServer.AcceptConnet(1): " + e.Message);
                }
            }
        }
    }
}
