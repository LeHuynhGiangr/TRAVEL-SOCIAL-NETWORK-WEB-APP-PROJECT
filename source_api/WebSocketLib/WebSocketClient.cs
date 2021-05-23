using System;
using System.Linq;
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

            receiveThread.IsBackground = true;
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
                numOfBytes = _TcpClient.Available;

                bytes = new byte[numOfBytes];
                networkStream.Read(bytes, 0, numOfBytes);
                plainTxt = Encoding.UTF8.GetString(bytes, 0, numOfBytes);

                byte[] response = Encoding.UTF8.GetBytes(CreateAcceptingResponse(plainTxt));
                networkStream.Write(response, 0, response.Length);

                Console.WriteLine(plainTxt);
                Console.WriteLine("----------------");
                int index = plainTxt.IndexOf("id=") + 3;
                string id = plainTxt.Substring(index, 36);

                Mediator.Register(Guid.Parse(id), Thread.CurrentThread.ManagedThreadId, callbackFunc: Send);

                networkStream.Flush();
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

                    byte[] unmaskedBytes;
                    DecodeData(bytes, out unmaskedBytes);
                    plainTxt = Encoding.UTF8.GetString(unmaskedBytes, 0, unmaskedBytes.Length);

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

        private string CreateAcceptingResponse(string request)
        {
            char[] seperator = { '\r', '\n' };
            string[] headers = request.Split(seperator, StringSplitOptions.RemoveEmptyEntries);
            string keyHeader = "Sec-WebSocket-Key: ";
            string key = "";
            string response = "";

            for (int i = 0; i < headers.Length; i++)
            {
                if (headers[i].IndexOf(keyHeader) >= 0)
                {
                    key = headers[i].Substring(keyHeader.Length);
                    break;
                }
            }

            if (key != String.Empty)
            {
                response =
                    "HTTP/1.1 101 Switching Protocols\r\n"//decides to upgrade the connection
                    + "Upgrade: websocket\r\n"
                    + "Connection: Upgrade\r\n"
                    + "Sec-WebSocket-Accept: " + Convert.ToBase64String(
                        System.Security.Cryptography.SHA1.Create().ComputeHash(
                            Encoding.UTF8.GetBytes(
                                key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
                                )
                            )
                        )
                    + "\r\n\r\n";
            }

            return response;
        }

        private void DecodeData(byte[] data, out byte[] unmaskedPayload)
        {
            int bytePos = 1;
            int payloadLen = data[bytePos++] & 0x7f;
            byte[] maskingKey = new byte[4];
            for (int i = 0; i < 4; i++)
            {
                maskingKey[i] = data[bytePos++];
            }

            //unmask payload
            unmaskedPayload = new byte[payloadLen];
            for (int i = 0; i < payloadLen; i++)
            {
                unmaskedPayload[i] = (byte)(data[bytePos++] ^ maskingKey[i % 4]);
            }
        }
    }
}
