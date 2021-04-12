/**
 * @file WSMediator.js
 * @author Giang Le Huynh
 * @since 0.0.1
 */

/**
 * Define module token
 */
const TOKEN_DEF={
    DEFAULT:0,
    MODULE1:1,
    MODULE2:2,
    MODULE3:3,
}

/**
 * Define ws url
 */
const WS_URL = "ws://127.0.0.1";

/**
 * Define mediator class
 */
class WSMediator{
    //#region Fields
    Clients=[]
    //#endregion Fields

    //#region Methods
    register(callbackFunc, token=TOKEN_DEF.DEFAULT){
        const obj={key:token, callbackFunc:callbackFunc};
        this.Clients.push(obj);
    }

    notify(token=TOKEN_DEF.DEFAULT, jsonData=[]){
        const listNotifiedClients = this.Clients[token];
        for(obj in listNotifiedClients){
            obj.callbackFunc(jsonData);
        }
    }
    //#endregion Methods
}

/**
 * Define event handler for web socket
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