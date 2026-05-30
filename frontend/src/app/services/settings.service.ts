import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly CHAT_ENABLED_KEY = 'chat_enabled';
  private readonly CLOSE_CHAT_ON_SEND_KEY = 'close_chat_on_send';
  private readonly PLAY_CHAT_NOTIF = 'play_chat_notif';
  private readonly PLAY_PING_NOTIF = 'play_ping_notif';

  private readonly _chatEnabled = signal(this.loadChatEnabled());
  private readonly _closeChatOnSend = signal(this.loadCloseChatOnSend());
  private readonly _playChatNotif = signal(this.loadPlayChatNotif());
  private readonly _playPingNotif = signal(this.loadPlayPingNotif());

  readonly chatEnabled = this._chatEnabled.asReadonly();
  readonly closeChatOnSend = this._closeChatOnSend.asReadonly();
  readonly playChatNotif = this._playChatNotif.asReadonly();
  readonly playPingNotif = this._playPingNotif.asReadonly();

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

  togglePlayChatNotif() {
    this._playChatNotif.set(!this._playChatNotif());
    localStorage.setItem(
      this.PLAY_CHAT_NOTIF,
      JSON.stringify(this._playChatNotif()),
    );
  }

  togglePlayPingNotif() {
    this._playPingNotif.set(!this._playPingNotif());
    localStorage.setItem(
      this.PLAY_PING_NOTIF,
      JSON.stringify(this._playPingNotif()),
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

  private loadPlayChatNotif(): boolean {
    const stored = localStorage.getItem(this.PLAY_CHAT_NOTIF);
    return stored === null ? true : JSON.parse(stored);
  }

  private loadPlayPingNotif(): boolean {
    const stored = localStorage.getItem(this.PLAY_PING_NOTIF);
    return stored === null ? true : JSON.parse(stored);
  }
}
