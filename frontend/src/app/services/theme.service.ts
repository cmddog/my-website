import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(this.getInitialTheme());
  isDarkMode$ = this.isDarkMode.asObservable();

  constructor() {
    this.applyTheme(this.isDarkMode.value);
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleTheme(): void {
    const newTheme = !this.isDarkMode.value;
    this.setTheme(newTheme);
  }

  setTheme(isDark: boolean): void {
    this.isDarkMode.next(isDark);
    //localStorage.setItem('theme', isDark ? 'dark' : 'light'); Add back once there is a theme toggle
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean): void {
    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'dark' : 'light',
    );
  }

  get iconColor(): string {
    return this.isDarkMode.value ? '6446ea' : 'faaf3a';
  }
}
