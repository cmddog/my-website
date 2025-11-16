import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '@types';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private readonly MAX_ACTIVE = 5;

  private activeToasts = signal<Toast[]>([]);
  private queuedToasts = signal<Toast[]>([]);
  private nextId = 0;

  readonly state = signal<{ active: Toast[]; queuedCount: number }>({
    active: [],
    queuedCount: 0,
  });

  show(message: string, type: ToastType = 'info', duration = 5000): void {
    const toast: Toast = {
      id: this.nextId++,
      type,
      message,
      duration,
    };
    const activeToasts = this.activeToasts();

    if (activeToasts.length < this.MAX_ACTIVE) {
      this.activeToasts.update((a) => [...a, toast]);
    } else {
      this.queuedToasts.update((q) => [...q, toast]);
    }
    this.emit();
  }

  remove(id: number): void {
    this.activeToasts.update((a) => a.filter((toast) => toast.id !== id));
    if (this.queuedToasts.length > 0) {
      this.queuedToasts.update((q) => {
        this.activeToasts.update((a) => [...a, q[0]]);
        return q.slice(1);
      });
    }
    this.emit();
  }

  clearAll() {
    this.activeToasts.set([]);
    this.queuedToasts.set([]);
    this.emit();
  }

  private emit(): void {
    this.state.set({
      active: [...this.activeToasts()],
      queuedCount: this.queuedToasts.length,
    });
  }
}
