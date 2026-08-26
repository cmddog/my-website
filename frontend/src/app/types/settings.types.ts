// --- Base ---
interface BaseSetting {
  type: string;
  id: string;
  label: string;
  description?: string;
}

// --- Setting Kinds ---
export interface ToggleSetting extends BaseSetting {
  type: 'toggle';
  defaultValue: boolean;
}

interface DropdownOption<T extends string = string> {
  label: string;
  value: T;
}

export interface DropdownSetting<T extends string = string>
  extends BaseSetting {
  type: 'dropdown';
  defaultValue: T;
  options: DropdownOption<T>[];
}

export type Setting = ToggleSetting | DropdownSetting;

// --- Category ---
export interface SettingsCategory {
  id: string;
  label: string;
  description?: string;
  settings: Setting[];
}

// --- Top Level ---
export interface SettingsData {
  id: string;
  categories: SettingsCategory[];
}
