import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { AuthService, ChatService } from '@services';
import { finalize } from 'rxjs/operators';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { DraggableContainerComponent } from '../draggable-container/draggable-container.component';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-chat',
  imports: [ChatMessageComponent, DraggableContainerComponent, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private readonly settings = inject(SettingsService);
  protected readonly chat = inject(ChatService);
  protected readonly auth = inject(AuthService);

  private readonly chatInputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('chatInput');
  private readonly chatWindowRef =
    viewChild.required<ElementRef<HTMLDivElement>>('chatWindow');
  readonly sending = signal(false);

  readonly loggingIn = signal(false);
  readonly registering = signal(false);
  loginUsername = '';
  loginPassword = '';
  registerUsername = '';
  registerPassword = '';
  registerConfirmPassword = '';
  secQuestion = '';
  secAnswer = '';
  readonly loginError = signal('');
  readonly registerError = signal('');
  readonly isLoading = signal(false);

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const chatInput = this.chatInputRef().nativeElement;
    const active = document.activeElement;
    const isTyping =
      active instanceof HTMLInputElement ||
      active instanceof HTMLTextAreaElement ||
      active instanceof HTMLSelectElement ||
      (active as HTMLElement)?.isContentEditable;

    if (event.key === 't' && !isTyping && chatInput !== active) {
      this.openChat();
      event.preventDefault();
    } else if (event.key === 'Escape') {
      chatInput.blur();
    }
  }

  openChat() {
    if (!this.chat.connectionState()) this.chat.connect();
    this.chatInputRef().nativeElement.focus();

    requestAnimationFrame(() => {
      const chatWindow = this.chatWindowRef().nativeElement;
      chatWindow.scrollTop = chatWindow.scrollHeight;
      this.onChatWindowScroll(chatWindow);
    });
  }

  sendMessage() {
    if (this.sending()) return;
    this.sending.set(true);

    const chatInput = this.chatInputRef().nativeElement;

    this.chat
      .sendMessage$(chatInput.value)
      .pipe(finalize(() => this.sending.set(false)))
      .subscribe({
        next: () => {
          chatInput.value = '';
          if (this.settings.closeChatOnSend()) chatInput.blur();
        },
        error: () => {},
      });
  }

  logIn() {
    if (this.isLoading() || !this.loginUsername || !this.loginPassword) return;
    this.isLoading.set(true);

    this.auth
      .login$(this.loginUsername, this.loginPassword)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.loginError.set('');
          this.loggingIn.set(false);
          this.chat.pushServerMessage('Logged in successfully', 'green');
        },
        error: (e: HttpErrorResponse) => {
          this.loginError.set(e.error?.message ?? 'An error occurred');
        },
      });
  }

  register() {
    if (this.isLoading() || !this.registerUsername || !this.registerPassword)
      return;
    if (this.registerPassword !== this.registerConfirmPassword) {
      this.registerError.set('Passwords must equal');
      return;
    }
    this.isLoading.set(true);

    this.auth
      .register$(
        this.registerUsername,
        this.registerPassword,
        this.secQuestion,
        this.secAnswer,
      )
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.registerError.set('');
          this.registering.set(false);
          this.chat.pushServerMessage(
            'Registered and logged in successfully',
            'green',
          );
        },
        error: (e: HttpErrorResponse) => {
          this.registerError.set(e.error?.message ?? 'An error occurred');
        },
      });
  }

  // ----- scrollbar stuff -----
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

    const normalizedScrollTop = scrollHeight - clientHeight + scrollTop;
    const thumbTop =
      (normalizedScrollTop / (scrollHeight - clientHeight)) *
      (clientHeight - thumbHeight);

    thumb.style.height = `${thumbHeight}px`;
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
