import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { SettingsService } from './services/settings.service';
import { generalSettings } from './components/settings/configs/general.settings';
import { AuthService, ChatService } from '@services';
import { chatModerationSettings } from './components/settings/configs/chat-moderation.settings';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => {
      const settings = inject(SettingsService);

      settings.register(chatModerationSettings);
      settings.register(generalSettings);
      if (settings.get('enable_chat')()) inject(ChatService).connect();

      inject(AuthService).refresh$().subscribe();
    }),
  ],
};
