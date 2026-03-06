import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isSwapped = signal(false);

  toggle(checked: boolean): void {
    this.isSwapped.set(checked);
    if (checked) localStorage.setItem('colour-swap', 'true');
    document.documentElement.setAttribute('data-theme', checked ? 'swap' : 'none');
  }
}
