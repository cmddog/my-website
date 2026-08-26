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
import { AccountFormsComponent } from './account-forms/account-forms.component';
import { SettingsService } from '../../services/settings.service';
import {
  ContextMenuComponent,
  ContextMenuItem,
} from '../context-menu/context-menu.component';
import { DisplayMessage } from '@types';

@Component({
  selector: 'app-chat',
  imports: [ChatMessageComponent, ContextMenuComponent, AccountFormsComponent],
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
  private readonly scrollbarRef =
    viewChild.required<ElementRef<HTMLDivElement>>('scrollbar');
  protected readonly accountForms = viewChild.required(AccountFormsComponent);
  readonly sending = signal(false);

  protected readonly contextMenuVisible = signal(false);
  protected readonly contextMenuItems = signal<ContextMenuItem[]>([]);
  private readonly contextMenu = viewChild.required(ContextMenuComponent);

  @HostListener('document:click')
  @HostListener('document:contextmenu')
  onDocumentClick() {
    this.contextMenuVisible.set(false);
  }

  @HostListener('window:blur')
  onBlur() {
    this.contextMenuVisible.set(false);
  }

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
    const state = this.chat.connectionState();
    if (state === 'idle' || state === 'failed') this.chat.connect();
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
          if (this.settings.get('close_chat_on_send')()) chatInput.blur();
        },
        error: () => {},
      });
  }

  onMessageContextMenu(event: MouseEvent, message: DisplayMessage) {
    event.preventDefault();
    event.stopPropagation();

    const items = message.sender
      ? this.chatMessageMenuItems(message)
      : this.serverMessageMenuItems(message);

    this.contextMenuItems.set(items);
    this.contextMenuVisible.set(true);
    this.contextMenu().open(event);
  }

  private chatMessageMenuItems(message: DisplayMessage): ContextMenuItem[] {
    const items: ContextMenuItem[] = [
      {
        label: 'Mention Sender',
        icon: 'at',
        action: () => {
          const chat = this.chatInputRef().nativeElement;
          chat.value = `${chat.value}@${message.sender} `;
          chat.focus();
        },
      },
    ];

    if (!message.deleted) {
      items.push({
        label: 'Copy Text',
        icon: 'copy',
        action: () => navigator.clipboard.writeText(message.content ?? ''),
      });
    }

    items.push({
      label: 'Copy Sender',
      icon: 'person',
      action: () => navigator.clipboard.writeText(message.sender ?? ''),
    });

    if (this.canDelete(message)) {
      items.push({
        label: 'Delete Message',
        icon: 'delete',
        danger: true,
        action: () => this.deleteMessage(message),
      });
    }

    return items;
  }

  private serverMessageMenuItems(message: DisplayMessage): ContextMenuItem[] {
    return [
      {
        label: 'Copy Text',
        icon: 'copy',
        action: () => navigator.clipboard.writeText(`[Server] ${message.text}`),
      },
    ];
  }

  private canDelete(message: DisplayMessage): boolean {
    if (message.deleted) return false;
    const identity = this.auth.identity();
    return (
      message.sender === identity.displayName ||
      identity.type === 'MODERATOR' ||
      identity.type === 'ADMIN'
    );
  }

  private deleteMessage(message: DisplayMessage): void {
    this.chat.deleteMessage$(message.id).subscribe({
      error: () =>
        this.chat.pushServerMessage('Failed to delete message', 'red', true),
    });
  }

  // ----- scrollbar stuff -----
  onChatWindowScroll(el: HTMLDivElement) {
    const thumb = this.scrollbarRef().nativeElement;

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
