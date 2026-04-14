import {
  Component,
  ElementRef,
  HostListener,
  inject,
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
    this.chatInputRef().nativeElement.focus();
  }
}
