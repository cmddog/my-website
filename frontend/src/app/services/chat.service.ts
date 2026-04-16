import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: number;
}

export interface ChatEvent {
  type: 'message' | 'history' | 'join' | 'leave';
  payload: string;
}

export interface MeResponse {
  type: 'user' | 'guest' | 'anonymous';
  displayName: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  private eventSource: EventSource | null = null;
  private retries = 0;
  private readonly MAX_RETRIES = 5;
  private readonly BASE_DELAY = 1000;
  private readonly MAX_DELAY = 30000;

  private readonly _messages = signal<ChatMessage[]>([]);
  private readonly _connected = signal(false);

  readonly messages = this._messages.asReadonly();
  readonly connected = this._connected.asReadonly();

  private retryDelay() {
    return Math.min(this.BASE_DELAY * 2 ** this.retries, this.MAX_DELAY);
  }

  connect(): void {
    console.log('trying to connect');
    if (this.eventSource) return;

    this.eventSource = new EventSource('/api/chat/stream', {
      withCredentials: true,
    });

    console.log('eventSource: ', this.eventSource);

    this.eventSource.addEventListener('chat', (e: MessageEvent) => {
      const event: ChatEvent = JSON.parse(e.data);

      if (event.type === 'history') {
        const msgs: ChatMessage[] = JSON.parse(event.payload);
        this._messages.set(msgs);
      } else if (event.type === 'message') {
        const msg: ChatMessage = JSON.parse(event.payload);
        this._messages.update((msgs) => [...msgs, msg].slice(0, 99));
      }
    });

    this.auth.refresh$();

    console.log('user: ', this.auth.identity());

    this.eventSource.onopen = () => {
      this.retries = 0;
      this._connected.set(true);
    };
    this.eventSource.onerror = () => {
      this._connected.set(false);

      if (this.retries < this.MAX_RETRIES) {
        setTimeout(() => {
          console.log(
            'failed, retrying. Count: ',
            this.retries,
            ', delay: ',
            this.retryDelay(),
          );
          this.retries++;
          this.eventSource?.close();
          this.eventSource = null;
          this.connect();
        }, this.retryDelay());
      } else {
        this.disconnect();
      }
    };
  }

  disconnect(): void {
    this.retries = 0;
    this.eventSource?.close();
    this.eventSource = null;
    this._connected.set(false);
    console.log('disconnected');
  }

  sendMessage$(content: string): Observable<any> {
    console.log('sending message');
    if (content.length > 256)
      return throwError(() => new Error('Message too long'));

    const endpoint = this.auth.isUser()
      ? '/api/chat/message'
      : '/api/chat/message/guest';
    console.log('is user? ', this.auth.isUser(), ', endpoint: ', endpoint);

    return this.http.post(endpoint, { content }, { withCredentials: true });
  }
}
