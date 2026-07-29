import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

interface BooleanSetting {
  readonly value: Signal<boolean>;
  toggle(): void;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly chatEnabledSetting = this.booleanSetting('chat_enabled');
  private readonly closeChatOnSendSetting =
    this.booleanSetting('close_chat_on_send');
  private readonly playChatNotifSetting =
    this.booleanSetting('play_chat_notif');
  private readonly playPingNotifSetting =
    this.booleanSetting('play_ping_notif');

  readonly chatEnabled = this.chatEnabledSetting.value;
  readonly closeChatOnSend = this.closeChatOnSendSetting.value;
  readonly playChatNotif = this.playChatNotifSetting.value;
  readonly playPingNotif = this.playPingNotifSetting.value;

  toggleChatEnabled = () => this.chatEnabledSetting.toggle();
  toggleCloseChatOnSend = () => this.closeChatOnSendSetting.toggle();
  togglePlayChatNotif = () => this.playChatNotifSetting.toggle();
  togglePlayPingNotif = () => this.playPingNotifSetting.toggle();

  /**
   * Creates a boolean setting backed by localStorage under the given key.
   * Defaults to `true` when no value has been persisted yet.
   */
  private booleanSetting(key: string, defaultValue = true): BooleanSetting {
    const stored = localStorage.getItem(key);
    const state: WritableSignal<boolean> = signal(
      stored === null ? defaultValue : JSON.parse(stored),
    );

    return {
      value: state.asReadonly(),
      toggle: () => {
        const next = !state();
        state.set(next);
        localStorage.setItem(key, JSON.stringify(next));
      },
    };
  }
}
