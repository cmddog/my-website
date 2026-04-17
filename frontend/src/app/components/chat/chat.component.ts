import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  protected readonly chat = inject(ChatService);

  private readonly chatInputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('chatInput');
  private readonly chatWindowRef =
    viewChild.required<ElementRef<HTMLDivElement>>('chatWindow');
  protected readonly sending = signal(false);

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const chatInput = this.chatInputRef().nativeElement;

    if (event.key === 't' && chatInput !== document.activeElement) {
      this.openChat();
      event.preventDefault();
    } else if (event.key === 'Escape') {
      chatInput.blur();
    }
  }

  openChat() {
    if (!this.chat.connected()) this.chat.connect();
    const chatWindow = this.chatWindowRef().nativeElement;
    setTimeout(() => (chatWindow.scrollTop = chatWindow.scrollHeight));
    this.chatInputRef().nativeElement.focus();
  }

  async sendMessage(): Promise<void> {
    if (this.sending()) return;
    this.sending.set(true);

    const chatInput = this.chatInputRef().nativeElement;

    this.chat.sendMessage$(chatInput.value).subscribe({
      next: (_) => {
        chatInput.value = '';
        chatInput.blur();
      },
      complete: () => {
        this.sending.set(false);
      },
    });
  }
}
