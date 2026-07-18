import {
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export interface ContextMenuItem {
  label: string;
  icon?: string;
  action: () => void;
  danger?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-context-menu',
  imports: [IconComponent],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
})
export class ContextMenuComponent {
  readonly items = input.required<ContextMenuItem[]>();
  readonly visible = input<boolean>(false);

  protected readonly hasIcons = computed(() =>
    this.items().some((i) => i.icon),
  );
  protected readonly safeItems = computed(() =>
    this.items().filter((i) => !i.danger),
  );
  protected readonly dangerItems = computed(() =>
    this.items().filter((i) => i.danger),
  );

  private readonly menuEl =
    viewChild.required<ElementRef<HTMLDivElement>>('menu');
  protected readonly x = signal(0);
  protected readonly y = signal(0);

  open(event: MouseEvent) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const { offsetWidth, offsetHeight } = this.menuEl().nativeElement;
        this.x.set(
          Math.min(event.clientX, window.innerWidth - offsetWidth - 8),
        );
        this.y.set(
          Math.min(event.clientY, window.innerHeight - offsetHeight - 8),
        );
      });
    });
  }
}
