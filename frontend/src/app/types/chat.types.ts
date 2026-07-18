export interface ChatEvent {
  type: 'MESSAGE' | 'HISTORY' | 'JOIN' | 'LEAVE' | 'MESSAGE_UPDATE';
  payload: string;
}

export interface ChatMessage {
  id: number;
  sender?: string;
  content: string;
  timestamp: number;
  deleted: boolean;
}

export interface DisplayMessage {
  kind: 'chat' | 'server';
  id: number;
  timestamp: number;
  // chat only
  receivedAt?: number;
  sender?: string;
  content?: string;
  deleted?: boolean;
  // server only
  text?: string;
  color?: 'white' | 'green' | 'yellow' | 'red';
  ephemeral?: boolean;
}

export const chatMessage = (
  data: ChatMessage,
  receivedAt?: number,
): DisplayMessage => ({
  kind: 'chat',
  id: data.id,
  timestamp: data.timestamp,
  receivedAt: receivedAt,
  sender: data.sender,
  content: data.content,
  deleted: data.deleted,
});

export const serverMessage = (
  text: string,
  color: DisplayMessage['color'],
  ephemeral: boolean,
): DisplayMessage => ({
  kind: 'server',
  id: Date.now(),
  timestamp: Date.now(),
  text,
  color,
  ephemeral,
});

export type ConnectionState =
  | 'connected'
  | 'connecting'
  | 'waiting_for_retry'
  | 'failed'
  | 'idle';
