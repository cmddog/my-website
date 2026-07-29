import { Component, inject } from '@angular/core';
import { ChatService, ThemeService } from '@services';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  private readonly theme = inject(ThemeService);
  protected readonly chat = inject(ChatService);
  protected readonly settings = inject(SettingsService);

  protected readonly isSwapped = this.theme.isSwapped;

  onThemeSwap(event: Event) {
    this.theme.toggle((event.target as HTMLInputElement).checked);
  }

  onToggleChat() {
    this.settings.toggleChatEnabled();
    if (this.settings.chatEnabled()) this.chat.connect();
    else this.chat.disconnect();
  }
}
