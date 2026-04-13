import {
  Component,
  ElementRef,
  HostListener,
  viewChild,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private readonly chatInputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('chatInput');

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const chatInput = this.chatInputRef().nativeElement;

    if (event.key === 't' && chatInput !== document.activeElement) {
      chatInput.focus();
      event.preventDefault();
    } else if (event.key === 'Escape') {
      chatInput.blur();
    }
  }
}
