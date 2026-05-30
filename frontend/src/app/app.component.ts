import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatService } from '@services';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {
    if (inject(SettingsService).chatEnabled()) inject(ChatService).connect();
  }
}
