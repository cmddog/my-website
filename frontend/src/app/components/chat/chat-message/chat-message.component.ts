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
    return `${t.getFullYear()}/${t.getMonth()}/${t.getDate()} ${t.getHours()}:${t.getMinutes().toString().length === 1 ? '0' : ''}${t.getMinutes()}`;
  });
}
