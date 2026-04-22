import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Observable, Subscription, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import {
  ChatEvent,
  chatMessage,
  ChatMessage,
  ConnectionState,
  DisplayMessage,
  serverMessage,
} from '@types';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // ---- Injections -----
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  // ----- Internal Values -----
  private retrySubscription: Subscription | null = null;
  private eventSource: EventSource | null = null;
  private retries = 0;
  private readonly MAX_RETRIES = 5;
  private readonly BASE_DELAY = 1000;
  private readonly MAX_DELAY = 20000;
  private readonly MESSAGE_FADEOUT = 10 * 1000;
  private readonly _tick = signal(0);
  private readonly _messages = signal<DisplayMessage[]>([]);
  private readonly _connectionState = signal<ConnectionState>('idle');
  private readonly _retryIn = signal(0);

  // ----- Public Values -----
  readonly messages = this._messages.asReadonly();
  readonly recentMessages = computed(() => {
    this._tick();
    return this.messages()
      .slice(-10)
      .filter((m) => Date.now() - m.timestamp < this.MESSAGE_FADEOUT);
  });
  readonly connectionState = this._connectionState.asReadonly();
  readonly connected = computed(() => this.connectionState() === 'connected');
  readonly retryIn = this._retryIn.asReadonly();

  // ----- Functions -----
  constructor() {
    effect(() => {
      const lastMessage = this.messages().at(-1);
      if (!lastMessage) return;
      setTimeout(() => this._tick.update((t) => t + 1), this.MESSAGE_FADEOUT);
    });
  }

  connect(): void {
    if (this.eventSource || this._connectionState() === 'connecting') return;
    this._connectionState.set('connecting');

    this.eventSource = new EventSource('/api/chat/stream', {
      withCredentials: true,
    });

    this.eventSource.addEventListener('chat', (e: MessageEvent) => {
      const event: ChatEvent = JSON.parse(e.data);

      if (event.type === 'HISTORY') {
        const msgs: ChatMessage[] = JSON.parse(event.payload);
        this._messages.set(msgs.map(chatMessage));
        this.pushServerMessage('Connected', 'green');
      } else if (event.type === 'MESSAGE') {
        const msg: ChatMessage = JSON.parse(event.payload);
        this._messages.update((msgs) =>
          [...msgs, chatMessage(msg)].slice(0, 99),
        );
      } else if (event.type === 'JOIN') {
        // TODO
      }
    });

    this.auth.refresh$();

    this.eventSource.onopen = () => {
      this.retries = 0;
      this._retryIn.set(0);
      this._connectionState.set('connected');
    };

    this.eventSource.onerror = () => {
      if (this._connectionState() === 'failed') return;

      this._connectionState.set('waiting_for_retry');
      if (this.retrySubscription) return;

      if (this.retries < this.MAX_RETRIES) {
        const delay = this.retryDelay();
        const seconds = delay / 1000;
        this._retryIn.set(seconds);

        this.retrySubscription = interval(1000)
          .pipe(take(seconds))
          .subscribe({
            next: (i) => this._retryIn.set(seconds - i - 1),
            complete: () => {
              this.retrySubscription = null;
              this.retries++;
              this.eventSource?.close();
              this.eventSource = null;
              this.connect();
            },
          });
      } else {
        this.disconnect();
      }
    };
  }

  disconnect(): void {
    this._connectionState.set('failed');
    this.retrySubscription?.unsubscribe();
    this.retrySubscription = null;
    this.retries = 0;
    this.eventSource?.close();
    this.eventSource = null;
  }

  sendMessage$(content: string): Observable<never> {
    if (this.connectionState() !== 'connected')
      return throwError(() => new Error('Not connected to the server'));

    if (content.length > 256 || !content.trim())
      return throwError(() => new Error('Message too long'));

    const endpoint = this.auth.isLoggedIn()
      ? '/api/chat/message'
      : '/api/chat/message/guest';

    return this.http.post<never>(
      endpoint,
      { content },
      { withCredentials: true },
    );
  }

  private pushServerMessage(
    text: string,
    color: DisplayMessage['color'] = 'white',
  ) {
    this._messages.update((msgs) =>
      [...msgs, serverMessage(text, color)].slice(0, 99),
    );
  }

  private retryDelay() {
    return Math.min(this.BASE_DELAY * 2 ** this.retries, this.MAX_DELAY);
  }
}
