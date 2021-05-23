import { Injectable } from "@angular/core";
import * as  WSMediator from 'src/assets/js/websocket/WSMediator.js';
import { ApiUrlConstants } from "../common/api-url.constants";

declare let StaticWSMediator: WSMediator.StaticWSMediator
declare let WebSocketHandler: WSMediator.WebSocketHandler
declare const SYS_TOKEN_DEF: WSMediator.SYS_TOKEN_DEF

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    _WebSocketHandler: WSMediator.WebSocketHandler;
    i = 0;
    flag = 0;

    constructor() {
        console.log("Call ws service constructor "+ this.i);
    }

    establishConnect(){
        //TODO: initializing WSMediator.WebSocketHandler
        /*
        console.log("establishing connection "+ this.i);
        this._WebSocketHandler = new WSMediator.WebSocketHandler(ApiUrlConstants.WS_URL);
        this.i += 1;
        */
    }

    async getFlag(): Promise<number>{
        while(this.flag ==0);
        return this.flag;
    }

    async sendMessage(message: string): Promise<void> {
        //TODO: call ws sent async
        /*
        this._WebSocketHandler.SendMessageToServer(message);
        */
    }
}