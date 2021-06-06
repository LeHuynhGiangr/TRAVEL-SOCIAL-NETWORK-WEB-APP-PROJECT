import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiUrlConstants } from '../common/api-url.constants';
import { UpdateChatBoxContentRequest } from '../models/models.request/UpdateChatBoxContentRequest';
import { ChatBoxResponse } from '../models/models.response/ChatBoxResponse';
import { UpdateChatBoxContentResponse } from '../models/models.response/UpdateChatBoxContentResponse';

@Injectable({
  providedIn: 'root'
})
export class ChattingService {
  private friendUrl: string = ApiUrlConstants.API_URL + '/friend';

  private loadChatUrl: string = ApiUrlConstants.API_URL + '/chat/single';
  private updateChatUrl: string = ApiUrlConstants.API_URL + '/chat/update';
  private syncChatUrl: string = ApiUrlConstants.API_URL + '/chat/sync';

  constructor(private m_http: HttpClient) { }

  getFriendDataById() {
    return this.m_http.get<any>(this.friendUrl, { observe: 'body', responseType: 'json' });
  }

  loadChatBox(id: string, theOtherId: string): Observable<ChatBoxResponse> {
    var response: any;

    response = this.m_http.get<ChatBoxResponse>(
      this.loadChatUrl + "/" + id + "/" + theOtherId,
      { observe: 'body', responseType: 'json' }
    ).pipe(catchError(this.handleError));

    return response;
  }

  syncChatBoxContent(userId: string, chatBoxId: string): Observable<UpdateChatBoxContentResponse> {
    var response: any;

    response = this.m_http.get<UpdateChatBoxContentResponse>(
      this.syncChatUrl + "/" + userId + "/" + chatBoxId,
      { observe: 'body', responseType: 'json' }
    ).pipe(catchError(this.handleError));

    return response;
  }

  updateChatBoxContent(request: UpdateChatBoxContentRequest): Observable<UpdateChatBoxContentRequest> {
    var response: any;

    response = this.m_http.post<UpdateChatBoxContentRequest>(
      this.updateChatUrl, request, { observe: 'body', responseType: 'json' }
    ).pipe(catchError(this.handleError));

    return response;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
      return throwError("Something bad happened; please check your internet and try again");
    } else {
      alert("Service is busy, please try again later")
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      return throwError("Service is busy, please try again later");
    }
  }
}
