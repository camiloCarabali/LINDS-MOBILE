import { Component, OnInit } from '@angular/core';

export interface ChatMessage {
  id: string;
  sender: 'driver' | 'client';
  message: string;
  timestamp: Date;
  type: 'text' | 'location' | 'image';
}

export interface ChatConversation {
  id: string;
  jobTitle: string;
  clientName: string;
  clientCompany: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: 'active' | 'completed';
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  conversations: ChatConversation[] = [
    {
      id: '1',
      jobTitle: 'Transporte de Mercancía General',
      clientName: 'Carlos Rodríguez',
      clientCompany: 'Logística Express SA',
      lastMessage: 'Confirma cuando llegues al punto de carga',
      lastMessageTime: new Date('2025-10-12T14:30:00'),
      unreadCount: 2,
      status: 'active'
    },
    {
      id: '2',
      jobTitle: 'Entrega de Materiales de Construcción',
      clientName: 'Ana García',
      clientCompany: 'Construcciones del Valle',
      lastMessage: 'Gracias por la entrega. Todo perfecto!',
      lastMessageTime: new Date('2025-10-11T16:45:00'),
      unreadCount: 0,
      status: 'completed'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  openChat(conversation: ChatConversation) {
    console.log('Abriendo chat con:', conversation.clientName);
    // Navegación al chat específico
  }

  getTimeAgo(date: Date): string {
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

}