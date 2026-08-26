import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { SettingsData } from '@types';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private values = new Map<string, WritableSignal<unknown>>();

  /**
   * Registers all {@link Setting}s from a {@link SettingsData} object to be gettable and settable with {@link get} and {@link set}.
   * @param settings The {@link SettingsData} object to register the settings from
   * @throws Error if a setting with a duplicate id is registered.
   */
  register(settings: SettingsData) {
    for (const category of settings.categories) {
      for (const setting of category.settings) {
        if (this.values.has(setting.id)) {
          throw new Error(`Setting with id '${setting.id}' already exists`);
        }

        const stored = localStorage.getItem(setting.id);
        const initial =
          stored !== null ? JSON.parse(stored) : setting.defaultValue;
        localStorage.setItem(setting.id, JSON.stringify(initial));
        this.values.set(setting.id, signal(initial));
      }
    }
  }

  /**
   * Returns a signal that emits the value of the setting with a given id
   * @param id The id of the setting to get
   */
  get<T>(id: string): Signal<T> {
    return this.values.get(id) as Signal<T>;
  }

  /**
   * Sets the value of the setting with a given id. Returns if the setting isn't registered.
   * @param id The id of the setting to set
   * @param value The value to set the setting to
   */
  set<T>(id: string, value: T) {
    const s = this.values.get(id) as WritableSignal<T> | undefined;
    if (!s) return;
    s.set(value);
    localStorage.setItem(id, JSON.stringify(value));
  }
}
