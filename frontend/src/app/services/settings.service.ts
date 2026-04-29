import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly CHAT_ENABLED_KEY = 'chat_enabled';
  private readonly CLOSE_CHAT_ON_SEND_KEY = 'close_chat_on_send';

  private _chatEnabled = signal(this.loadChatEnabled());
  private _closeChatOnSend = signal(this.loadCloseChatOnSend());

  readonly chatEnabled = this._chatEnabled.asReadonly();
  readonly closeChatOnSend = this._closeChatOnSend.asReadonly();

  toggleChatEnabled() {
    this._chatEnabled.set(!this._chatEnabled());
    localStorage.setItem(
      this.CHAT_ENABLED_KEY,
      JSON.stringify(this._chatEnabled()),
    );
  }

  toggleCloseChatOnSend() {
    this._closeChatOnSend.set(!this._closeChatOnSend());
    localStorage.setItem(
      this.CLOSE_CHAT_ON_SEND_KEY,
      JSON.stringify(this._closeChatOnSend()),
    );
  }

  private loadChatEnabled(): boolean {
    const stored = localStorage.getItem(this.CHAT_ENABLED_KEY);
    return stored === null ? true : JSON.parse(stored);
  }

  private loadCloseChatOnSend(): boolean {
    const stored = localStorage.getItem(this.CLOSE_CHAT_ON_SEND_KEY);
    return stored === null ? true : JSON.parse(stored);
  }
}
