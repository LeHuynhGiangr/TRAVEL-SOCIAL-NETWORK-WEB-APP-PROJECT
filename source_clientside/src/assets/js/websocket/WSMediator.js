/**
 * @file WSMediator.js
 * @author Giang Le Huynh
 * @since 0.0.1
 */

/**
 * Define module token
 */
export class SYS_TOKEN_DEF{
    static ON_ERROR = "ON_ERROR";
    static ON_CLOSED = "ON_CLOSED";
    static ON_OPENED = "ON_OPENED";
    static DEFAULT = "DEFAULT";
    static BROADCAST = "BROADCAST";
    static MODULE1 = "MODULE1";
    static MODULE2 = "MODULE2";
    static MODULE3 = "MODULE3";
    static FRIEND_LOGIN = "FRIEND_LOGIN";
    static NEW_POST = "FRIEND_POST";
    static NEW_COMMENT = "FRIEND_COMMENT";
    static SYNC_MESG_CHAT = "SYNC_MESG_CHAT";
}

/**
 * Define static mediator class
 */
export class StaticWSMediator {
    //#region Fields
    static s_clients = []
    static i = 0
    //#endregion Fields

    //#region Methods
    static register(callbackFunc, token = SYS_TOKEN_DEF.DEFAULT) {
        const obj = { key: token, callbackFunc: callbackFunc };
        StaticWSMediator.s_clients.push(obj);
        console.log(StaticWSMediator.i)
        console.log(StaticWSMediator.s_clients);
        console.log("already registered");
    }

    static notify(token = SYS_TOKEN_DEF.DEFAULT, jsonData = []) {
        console.log("notify to:");
        console.log(StaticWSMediator.s_clients);
        const listNotifiedClients = StaticWSMediator.s_clients.filter(_ => _.key == token);
        listNotifiedClients.forEach((i, k) => {
            i.callbackFunc(jsonData);
        });
        /*
        console.log(listNotifiedClients);
        for ({obj} in listNotifiedClients) {
            console.log(obj);
            obj.callbackFunc(jsonData);
        }
        */
    }
    //#endregion Methods
}

/**
 * Define event handler for web socket
 */
export class WebSocketHandler {
    static s_ws;
    static s_url;

    static EstablishConnect(url){
        WebSocketHandler.s_url=url;
        WebSocketHandler.InitWebSocket();
    }
    
    //#region Methods
    static InitWebSocket(){
        WebSocketHandler.s_ws = new WebSocket(WebSocketHandler.s_url);
        //add callback func for message event
        WebSocketHandler.s_ws.onmessage = WebSocketHandler.OnReceivedEventHandler;
        //add callback func for open event
        WebSocketHandler.s_ws.onopen = WebSocketHandler.OnOpenedEventHandler;
        //add callback func for close event
        WebSocketHandler.s_ws.onclose = WebSocketHandler.OnClosedEventHandler;
        //add callback func for error event
        WebSocketHandler.s_ws.onerror = WebSocketHandler.OnErrorEventHandler;
    }

    static OnOpenedEventHandler(event) {
        console.log("On Opened");
        StaticWSMediator.notify(SYS_TOKEN_DEF.ON_OPENED, []);
    }

    static OnReceivedEventHandler(event) {
        console.log("receive: "+ event.data);
        StaticWSMediator.notify(event.data, []);
    }

    static OnClosedEventHandler(event) {
        console.log(event);
        //StaticWSMediator.notify(SYS_TOKEN_DEF.BROADCAST, []);
    }

    static OnErrorEventHandler(event) {
        console.log(event);
        //StaticWSMediator.notify(SYS_TOKEN_DEF.BROADCAST, []);
    }
    
    static SendMessageToServer(message) {
        //this.GetWebSocket().send(message);
        console.log("sent message to server");
        WebSocketHandler.s_ws.send(message)
        //return true;
    }
    //#endregion Methods
}