/**
 * @file websocketHandler.js
 * @author Giang Le Huynh
 * @since 0.0.1
 */
const URL_TO_SERVER = "ws://127.0.0.1";
/**
 * 
 */
class WebSocketHandler {
    //#region Fields
    _webSocket
    //#endregion Fields
    
    constructor() {
        this._webSocket = new WebSocket(this);
        webSocket.addEventListener("message", this.OnReceivedEventHandler);
        webSocket.addEventListener("open", this.OnOpenedEventHandler);
        webSocket.addEventListener("close", this.OnClosedEventHandler);
        webSocket.addEventListener("error", this.OnErrorEventHandler);
    }

    //#region Methods
    SendMessageToServer() {
        return true;
    }

    ReceiveDelegate() {

    }

    CloseDelegate() {

    }

    OnOpenedEventHandler(){

    }

    OnReceivedEventHandler(params) {

    }

    OnClosedEventHandler() {

    }

    OnErrorEventHandler(){

    }
    //#endregion Methods
}