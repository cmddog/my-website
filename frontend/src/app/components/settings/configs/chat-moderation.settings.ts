import { SettingsData } from '@types';

export const chatModerationSettings: SettingsData = {
  id: 'chatModeration',
  categories: [
    {
      id: 'general',
      label: 'General',
      settings: [
        {
          type: 'toggle',
          id: 'disable_guests',
          label: 'Prevent guests from chatting',
          defaultValue: false,
        },
        {
          type: 'toggle',
          id: 'disable_signups',
          label: 'Disable new signups',
          defaultValue: false,
        },
      ],
    },
  ],
};
