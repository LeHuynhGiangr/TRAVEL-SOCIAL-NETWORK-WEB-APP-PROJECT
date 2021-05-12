using System;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using MediationLib;

namespace WebSocketLib
{
    public class WebSocketClient
    {
        private Guid _ClientId;
        private int _ClientNo;
        private TcpClient _TcpClient;

        public WebSocketClient(TcpClient client)
        {
            _TcpClient = client;
        }

        public WebSocketClient(TcpClient client, Guid clientId, int clientNo)
        {
            _TcpClient = client;
            _ClientId = clientId;
            _ClientNo = clientNo;
        }

        public void Start()
        {
            Thread receiveThread = new Thread(HandleReceive);
            Thread sendThread = new Thread(HandleReceive);
            receiveThread.Start();
        }

        public void HandleReceive()
        {
            int numOfBytes;
            byte[] bytes;
            string plainTxt;
            NetworkStream networkStream = _TcpClient.GetStream();

            try
            {
                while (!networkStream.DataAvailable) { };
                while (_TcpClient.Available < 50) { };
                numOfBytes = _TcpClient.Available;

                bytes = new byte[numOfBytes];
                networkStream.Read(bytes, 0, numOfBytes);
                networkStream.Flush();
                plainTxt = Encoding.UTF8.GetString(bytes, 0, numOfBytes);
                int index = plainTxt.IndexOf("id=") + 3;
                string id = plainTxt.Substring(index, 36);
                Console.WriteLine("Receive {0} bytes: {1}", numOfBytes, id);
                Mediator.Register(Guid.Parse(id), Thread.CurrentThread.ManagedThreadId, callbackFunc: Send);
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception from WebSocketClient.HandleReceive(1): " + e.Message);
            }

            while (true)
            {
                try
                {
                    while (!networkStream.DataAvailable) ;//pass this line when stream has data for reading

                    numOfBytes = _TcpClient.Available;

                    bytes = new byte[numOfBytes];
                    networkStream.Read(bytes, 0, numOfBytes);
                    plainTxt = Encoding.UTF8.GetString(bytes, 0, numOfBytes);
                    Console.WriteLine("Receive data: " + plainTxt);
                    //TODO: sending sent flag to client 
                    networkStream.Flush();
                }
                catch (Exception e)
                {
                    Console.WriteLine("Exception from WebSocketClient.HandleReceive(2): " + e.Message);
                }
            }
        }

        public void Send(object obj)
        {
            byte[] message;
            NetworkStream networkStream = _TcpClient.GetStream();

            try
            {
                //while (networkStream.DataAvailable) { };

                message = Encoding.UTF8.GetBytes((string)obj);
                networkStream.Write(message, 0, message.Length);
                networkStream.Flush();
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception from WebSocketClient.Send(1): " + e.Message);
            }
        }
    }
}
