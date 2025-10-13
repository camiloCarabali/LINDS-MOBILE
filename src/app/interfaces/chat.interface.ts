export interface ChatConversation {
  id: string;
  jobId: string;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  status: ConversationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatParticipant {
  id: string;
  type: 'driver' | 'client' | 'admin';
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'driver' | 'client' | 'admin';
  content: string;
  timestamp: Date;
  status: MessageStatus;
  isEdited: boolean;
}

export type MessageStatus = 
  | 'sending' 
  | 'sent' 
  | 'delivered' 
  | 'read' 
  | 'failed';

export type ConversationStatus = 
  | 'active' 
  | 'archived' 
  | 'blocked' 
  | 'completed';

export interface SendMessageDto {
  conversationId: string;
  content: string;
}

export interface CreateConversationDto {
  jobId: string;
  participantIds: string[];
  initialMessage?: string;
}

export interface BackendChatMessage {
  id: number;
  conversation_id: number;
  sender_id: string;
  sender_name: string;
  content: string;
  message_type: string;
  created_at: string;
  is_read: boolean;
  metadata?: any;
}

export interface BackendChatConversation {
  id: number;
  envio_id: number;
  client_id: string;
  client_name: string;
  driver_id: string;
  driver_name: string;
  status: string;
  last_message?: BackendChatMessage;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface BackendSendMessageDto {
  content: string;
  message_type?: string;
  metadata?: any;
}

export interface BackendCreateConversationDto {
  job_id: number;
}

export type BackendConversationStatus = 'active' | 'archived' | 'blocked';
export type BackendMessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';