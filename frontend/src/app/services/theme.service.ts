import { effect, inject, Injectable, signal } from '@angular/core';
import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly settings = inject(SettingsService);

  readonly isSwapped = signal(false);

  constructor() {
    effect(() => this.toggle(this.settings.get<boolean>('swap_colours')()));
  }

  toggle(checked: boolean): void {
    this.isSwapped.set(checked);
    if (checked) localStorage.setItem('colour-swap', 'true');
    else localStorage.removeItem('colour-swap');
    document.documentElement.setAttribute(
      'data-theme',
      checked ? 'swap' : 'none',
    );
  }
}
