/**
 * @file WSMediator.js
 * @author Giang Le Huynh
 * @since 0.0.1
 */

/**
 * Define module token
 */
export class SYS_TOKEN_DEF{
    ON_ERROR = "ON_ERROR";
    ON_CLOSED = "ON_CLOSED";
    ON_OPENED = "ON_OPENED";
    DEFAULT = "DEFAULT";
    BROADCAST = "BROADCAST";
    MODULE1 = "MODULE1";
    MODULE2 = "MODULE2";
    MODULE3 = "MODULE3";
    FRIEND_LOGIN = "FRIEND_LOGIN";
    NEW_POST = "FRIEND_POST";
    NEW_COMMENT = "FRIEND_COMMENT";
}

/**
 * Define static mediator class
 */
export class StaticWSMediator {
    //#region Fields
    static s_clients = []
    //#endregion Fields

    //#region Methods
    static register(callbackFunc, token = SYS_TOKEN_DEF.DEFAULT) {
        const obj = { key: token, callbackFunc: callbackFunc };
        StaticWSMediator.s_clients.push(obj);
    }

    static notify(token = SYS_TOKEN_DEF.DEFAULT, jsonData = []) {
        const listNotifiedClients = StaticWSMediator.s_clients.filter(_ => _.token == token);
        for (obj in listNotifiedClients) {
            obj.callbackFunc(jsonData);
        }
    }
    //#endregion Methods
}

/**
 * Define event handler for web socket
 */
export class WebSocketHandler {

    constructor(url) {
        this._url = url;
        this.InitWebSocket();
    }
    
    //#region Methods
    InitWebSocket(){
        this._webSocket = new WebSocket(this._url);
        //add callback func for message event
        this._webSocket.onmessage = this.OnReceivedEventHandler;
        //add callback func for open event
        this._webSocket.onopen = this.OnOpenedEventHandler;
        //add callback func for close event
        this._webSocket.onclose = this.OnClosedEventHandler;
        //add callback func for error event
        this._webSocket.onerror = this.OnErrorEventHandler;
    }

    GetWebSocket(){
        if(this._webSocket == null){
            this.InitWebSocket();
        }
        else if(this._webSocket.readyState == WebSocket.CLOSED){
            this.InitWebSocket();
        }
        return this._webSocket;
    }

    OnOpenedEventHandler(event) {
        StaticWSMediator.notify(SYS_TOKEN_DEF.ON_OPENED, []);
        console.log("On Opened");
    }

    OnReceivedEventHandler(event) {
        //StaticWSMediator.notify(event.data, []);
        console.log("event.data");
    }

    OnClosedEventHandler(event) {
        StaticWSMediator.notify(SYS_TOKEN_DEF.BROADCAST, []);
        console.log(event.data);
    }

    OnErrorEventHandler(event) {
        //StaticWSMediator.notify(SYS_TOKEN_DEF.BROADCAST, []);
        console.log(event.data);
    }
    SendMessageToServer(message) {
        this.GetWebSocket().send(message);
        return true;
    }
    //#endregion Methods
}