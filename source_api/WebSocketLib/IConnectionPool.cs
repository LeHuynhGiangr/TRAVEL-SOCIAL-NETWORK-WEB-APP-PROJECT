namespace WebSocketLib
{
    interface IConnectionPool<T>
    {
        bool AddNewConnect();
        bool DeleteConnection();
        bool IsConnect(T id);
        bool SendBytesTo(T id, byte[] data);
        bool SendXmlStrTo(T id, string xmlStr);
        bool SendJsonStrTo(T id, string jsonStr);
        object Serialization(object o);
        object Deserialization(object o);
    }
}
