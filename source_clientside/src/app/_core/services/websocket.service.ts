import { Injectable } from "@angular/core";
import * as  WSMediator from 'src/assets/js/websocket/WSMediator.js';
import { ApiUrlConstants } from '../../_core/common/api-url.constants';

declare let StaticWSMediator: WSMediator.StaticWSMediator
declare let WebSocketHandler: WSMediator.WebSocketHandler
declare const SYS_TOKEN_DEF: WSMediator.SYS_TOKEN_DEF

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    static _SYS_TOKEN_DEF = new WSMediator.SYS_TOKEN_DEF();
    static _StaticWSMediator : WSMediator.StaticWSMediator;
    _WebSocketHandler: WSMediator.WebSocketHandler;

    constructor() {
        this._WebSocketHandler = new WSMediator.WebSocketHandler(ApiUrlConstants.WS_URL);
    }

    sendMessage(message: string): void {
        var resutl = this._WebSocketHandler.SendMessageToServer(message);
        var t = 0;
    }

    register(callbackFunc: any, token: WSMediator.SYS_TOKEN_DEF): void {

    }
}