import { SettingsData } from '@types';

export const generalSettings: SettingsData = {
  id: 'general',
  categories: [
    {
      id: 'general',
      label: 'General',
      settings: [
        {
          type: 'toggle',
          id: 'swap_colours',
          label: 'Swap primary and accent colours',
          defaultValue: false,
        },
      ],
    },
    {
      id: 'chat',
      label: 'Chat',
      settings: [
        {
          type: 'toggle',
          id: 'enable_chat',
          label: 'Enable chat',
          defaultValue: true,
        },
        {
          type: 'toggle',
          id: 'close_chat_on_send',
          label: 'Close chat on send',
          defaultValue: true,
        },
        {
          type: 'toggle',
          id: 'play_chat_notif',
          label: 'Play notification sound on new message',
          defaultValue: true,
        },
        {
          type: 'toggle',
          id: 'play_ping_notif',
          label: 'Play notification sound on ping',
          defaultValue: true,
        },
      ],
    },
  ],
};
