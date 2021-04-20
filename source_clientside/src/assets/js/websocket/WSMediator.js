/**
 * @file WSMediator.js
 * @author Giang Le Huynh
 * @since 0.0.1
 */

/**
 * Define module token
 */
export const SYS_TOKEN_DEF = {
    DEFAULT: 0,
    BROADCAST:1,//all
    MODULE1: 2,
    MODULE2: 3,
    MODULE3: 4,
}

/**
 * Define ws url
 */
export const WS_URL = "\x77\x73\x3a\x2f\x2f\x31\x327\x2e0\x2e0\x2e1";

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
        this.s_clients.push(obj);
    }

    static notify(token = SYS_TOKEN_DEF.DEFAULT, jsonData = []) {
        const listNotifiedClients = this.s_clients[token];
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
    
    constructor() {
        //create connection
        this._webSocket = new WebSocket(WS_URL);
        //add callback func for message event
        this._webSocket.onmessage = this.OnReceivedEventHandler;
        //add callback func for open event
        this._webSocket.onopen = this.OnOpenedEventHandler;
        //add callback func for close event
        this._webSocket.onclose = this.OnClosedEventHandler;
        //add callback func for error event
        this._webSocket.onerror = this.OnErrorEventHandler;
    }

    //#region Methods
    OnOpenedEventHandler(event) {
        StaticWSMediator.notify(SYS_TOKEN_DEF.BROADCAST, []);
        console.log(event.data);
    }

    OnReceivedEventHandler(event) {
        StaticWSMediator.notify(SYS_TOKEN_DEF.DEFAULT, []);
        console.log(event.data);
    }

    OnClosedEventHandler(event) {
        StaticWSMediator.notify(SYS_TOKEN_DEF.BROADCAST, []);
        console.log(event.data);
    }

    OnErrorEventHandler(event) {
        StaticWSMediator.notify(SYS_TOKEN_DEF.BROADCAST, []);
        console.log(event.data);
    }
    SendMessageToServer() {
        return true;
    }
    //#endregion Methods
}

//let _WebSocketHandler = new WebSocketHandler();