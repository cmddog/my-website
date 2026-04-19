import { Component, input } from '@angular/core';
import { DisplayMessage } from '@types';

@Component({
  selector: 'app-chat-message',
  imports: [],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent {
  readonly message = input.required<DisplayMessage>();
}
