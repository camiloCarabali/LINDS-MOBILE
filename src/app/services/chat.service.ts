import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import {
  BackendChatConversation,
  BackendChatMessage,
  BackendSendMessageDto,
  BackendCreateConversationDto,
  ApiResponse,
  LoadingState
} from '../interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly API_URL = environment.apiUrl;

  private conversationsSubject = new BehaviorSubject<BackendChatConversation[]>([]);
  public conversations$ = this.conversationsSubject.asObservable();

  private activeConversationSubject = new BehaviorSubject<BackendChatConversation | null>(null);
  public activeConversation$ = this.activeConversationSubject.asObservable();

  private messagesSubject = new BehaviorSubject<BackendChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private loadingStateSubject = new BehaviorSubject<LoadingState>({
    isLoading: false
  });
  public loadingState$ = this.loadingStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.getConversations();
  }

  getConversations(): Observable<BackendChatConversation[]> {
    this.setLoading(true);

    return this.http.get<ApiResponse<BackendChatConversation[]>>(`${this.API_URL}/chat/conversations`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Error getting conversations');
          }
          return response.data;
        }),
        tap(conversations => {
          this.conversationsSubject.next(conversations);
          this.setLoading(false);
        }),
        catchError(error => {
          this.setLoading(false, error.message);
          return throwError(error);
        })
      );
  }

  createConversation(conversationData: BackendCreateConversationDto): Observable<BackendChatConversation> {
    return this.http.post<ApiResponse<BackendChatConversation>>(`${this.API_URL}/chat/conversations`, conversationData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Error creating conversation');
          }
          return response.data;
        }),
        tap(conversation => {
          const currentConversations = this.conversationsSubject.value;
          this.conversationsSubject.next([conversation, ...currentConversations]);
        }),
        catchError(this.handleError)
      );
  }

  getMessages(conversationId: number, page: number = 1, limit: number = 50): Observable<BackendChatMessage[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<BackendChatMessage[]>>(`${this.API_URL}/chat/conversations/${conversationId}/messages`, { params })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Error getting messages');
          }
          return response.data;
        }),
        tap(messages => {
          if (page === 1) {
            this.messagesSubject.next(messages);
          } else {
            const currentMessages = this.messagesSubject.value;
            this.messagesSubject.next([...currentMessages, ...messages]);
          }
        }),
        catchError(this.handleError)
      );
  }

  sendMessage(conversationId: number, messageData: BackendSendMessageDto): Observable<BackendChatMessage> {
    return this.http.post<ApiResponse<BackendChatMessage>>(`${this.API_URL}/chat/conversations/${conversationId}/messages`, messageData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Error sending message');
          }
          return response.data;
        }),
        tap(message => {
          const currentMessages = this.messagesSubject.value;
          this.messagesSubject.next([message, ...currentMessages]);
          this.updateConversationLastMessage(conversationId, message);
        }),
        catchError(this.handleError)
      );
  }

  sendTextMessage(conversationId: number, content: string): Observable<BackendChatMessage> {
    const messageData: BackendSendMessageDto = {
      content,
      message_type: 'text'
    };

    return this.sendMessage(conversationId, messageData);
  }

  setActiveConversation(conversation: BackendChatConversation | null): void {
    this.activeConversationSubject.next(conversation);
    
    if (conversation) {
      this.getMessages(conversation.id);
    } else {
      this.messagesSubject.next([]);
    }
  }

  getActiveConversation(): BackendChatConversation | null {
    return this.activeConversationSubject.value;
  }

  private updateConversationLastMessage(conversationId: number, message: BackendChatMessage): void {
    const conversations = this.conversationsSubject.value;
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          last_message: message,
          updated_at: message.created_at
        };
      }
      return conv;
    });
    this.conversationsSubject.next(updatedConversations);
  }

  private setLoading(isLoading: boolean, error?: string): void {
    this.loadingStateSubject.next({
      isLoading,
      error,
      lastUpdated: new Date()
    });
  }

  private handleError = (error: any): Observable<never> => {
    let errorMessage = 'Error desconocido';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('Chat Service Error:', error);
    return throwError(errorMessage);
  };
}