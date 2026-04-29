import {
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { ThemeService } from '@services';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private readonly theme = inject(ThemeService);
  protected readonly settings = inject(SettingsService);

  private readonly swapThemeCheckboxRef =
    viewChild.required<ElementRef<HTMLInputElement>>('swapTheme');
  private readonly enableChatCheckboxRef =
    viewChild.required<ElementRef<HTMLInputElement>>('enableChat');
  private readonly closeOnSendCheckboxRef =
    viewChild.required<ElementRef<HTMLInputElement>>('closeOnSend');

  ngOnInit() {
    if (this.theme.isSwapped()) {
      this.swapThemeCheckboxRef().nativeElement.checked = true;
    }
    if (this.settings.chatEnabled()) {
      this.enableChatCheckboxRef().nativeElement.checked = true;
    }
    if (this.settings.closeChatOnSend()) {
      this.closeOnSendCheckboxRef().nativeElement.checked = true;
    }
  }

  onThemeSwap(event: Event) {
    this.theme.toggle((event.target as HTMLInputElement).checked);
  }
}
