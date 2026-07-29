import { Component, computed, input } from '@angular/core';
import { DisplayMessage } from '@types';

@Component({
  selector: 'app-chat-message',
  imports: [],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent {
  readonly message = input.required<DisplayMessage>();
  time = computed(() => {
    const t = new Date(this.message().timestamp);
    const date = `${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()}`;
    const minutes = t.getMinutes().toString().padStart(2, '0');
    return `${date} ${t.getHours()}:${minutes}`;
  });
}
