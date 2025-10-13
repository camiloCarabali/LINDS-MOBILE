import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../../services';
import { BackendChatConversation, LoadingState } from '../../interfaces';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {

  conversations: BackendChatConversation[] = [];
  loadingState: LoadingState = { isLoading: false };
  
  private destroy$ = new Subject<void>();

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.initializeData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeData(): void {
    this.chatService.conversations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(conversations => {
        this.conversations = conversations;
      });

    this.chatService.loadingState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loadingState => {
        this.loadingState = loadingState;
      });

    this.chatService.getConversations().subscribe();
  }

  openChat(conversation: BackendChatConversation): void {
    this.chatService.setActiveConversation(conversation);
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays}d`;
    }
  }

  refreshConversations(): void {
    this.chatService.getConversations().subscribe();
  }
}