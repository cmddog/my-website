export interface ChatEvent {
  type: 'MESSAGE' | 'HISTORY' | 'JOIN' | 'LEAVE';
  payload: string;
}

export interface ChatMessage {
  id: number;
  sender?: string;
  content: string;
  timestamp: number;
}

export interface DisplayMessage {
  kind: 'chat' | 'server';
  id: number;
  timestamp: number;
  // chat only
  sender?: string;
  content?: string;
  // server only
  text?: string;
  color?: 'white' | 'green' | 'yellow' | 'red';
}

export const chatMessage = (data: ChatMessage): DisplayMessage => ({
  kind: 'chat',
  id: data.id,
  timestamp: data.timestamp,
  sender: data.sender,
  content: data.content,
});

export const serverMessage = (
  text: string,
  color: DisplayMessage['color'] = 'green',
): DisplayMessage => ({
  kind: 'server',
  id: Date.now(),
  timestamp: Date.now(),
  text,
  color,
});

export type ConnectionState =
  | 'connected'
  | 'connecting'
  | 'waiting_for_retry'
  | 'failed'
  | 'idle';
