import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { finalize } from 'rxjs/operators';

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

  constructor() {
    effect(() => {
      this.chat.messages();
    });
  }

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
    setTimeout(() => {
      chatWindow.scrollTop = chatWindow.scrollHeight;
      this.onChatWindowScroll(chatWindow);
    });
    this.chatInputRef().nativeElement.focus();
  }

  sendMessage() {
    if (this.sending()) return;
    this.sending.set(true);

    const chatInput = this.chatInputRef().nativeElement;

    this.chat
      .sendMessage$(chatInput.value)
      .pipe(finalize(() => this.sending.set(false)))
      .subscribe({
        next: (_) => {
          chatInput.value = '';
          chatInput.blur();
        },
        error: (_) => {},
      });
  }

  // ----- scrollbar stuff -----
  protected readonly scrollThumb = computed(() => {
    // depend on messages so it recalculates when content changes
    this.chat.messages();
    return { height: 0, top: 0 };
  });

  onChatWindowScroll(el: HTMLDivElement) {
    const thumb = document.getElementById('scrollbar') as HTMLElement;
    if (!thumb) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const ratio = clientHeight / scrollHeight;

    if (ratio >= 1) {
      thumb.style.display = 'none';
      return;
    }

    const thumbHeight = ratio * clientHeight;
    const thumbTop = (scrollTop / scrollHeight) * clientHeight;

    thumb.style.height = `${thumbHeight}px`;
    // position relative to the chat window's own top using getBoundingClientRect
    const windowRect = el.getBoundingClientRect();
    thumb.style.top = `${windowRect.top + thumbTop}px`;
    thumb.style.left = `${windowRect.right - 4}px`;
  }

  onChatWindowWheel(event: WheelEvent, el: HTMLDivElement) {
    event.preventDefault();
    const messageHeight = el.clientHeight / 20;
    el.scrollTop += Math.sign(event.deltaY) * messageHeight * 7;
    this.onChatWindowScroll(el);
  }
}
