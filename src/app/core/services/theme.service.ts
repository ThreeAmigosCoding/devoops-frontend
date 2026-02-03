import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly _isDark = signal(false);
  readonly isDark = this._isDark.asReadonly();

  constructor() {
    const stored = localStorage.getItem('devoops-theme');
    if (stored === 'dark') {
      this._isDark.set(true);
      this.applyClass(true);
    }
  }

  toggle(): void {
    const next = !this._isDark();
    this._isDark.set(next);
    this.applyClass(next);
    localStorage.setItem('devoops-theme', next ? 'dark' : 'light');
  }

  private applyClass(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }
}
