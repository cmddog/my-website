import {
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { AboutMeComponent } from './about-me/about-me.component';
import { DraggableContainerComponent } from '../draggable-container/draggable-container.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { NeighbourhoodComponent } from './neighbourhood/neighbourhood.component';
import { SettingsComponent } from './settings/settings.component';
import { BreakpointService } from '@services';
import { AsyncPipe } from '@angular/common';
import { ChatComponent } from '../chat/chat.component';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-home',
  imports: [
    AboutMeComponent,
    DraggableContainerComponent,
    ChangelogComponent,
    NeighbourhoodComponent,
    SettingsComponent,
    AsyncPipe,
    ChatComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  // tmp
  protected readonly breakpointService = inject(BreakpointService);

  protected settings = inject(SettingsService);

  readonly windows = new Map([
    ['introduction', 'Introduction'],
    ['changelog', 'Changelog'],
    ['neighbourhood', 'Neighbourhood'],
    ['settings', 'Settings'],
  ]);

  private readonly taskBarButtons =
    viewChildren<ElementRef<HTMLButtonElement>>('taskBarButton');
  private zCounter = 1;
  readonly taskbarButtonPositions = signal<number[]>([]);
  readonly zIndices = signal<Record<string, number>>({});
  readonly openWindows = signal(new Set(['introduction']));
  readonly taskbarEntries = computed(() =>
    [...this.windows.entries()].filter(([id]) => !this.openWindows().has(id)),
  );

  constructor() {
    const resizeObserver = new ResizeObserver(() =>
      this.computeTaskbarPositions(),
    );

    afterRenderEffect(() => {
      this.openWindows();
      this.computeTaskbarPositions();
    });

    inject(DestroyRef).onDestroy(() => resizeObserver.disconnect());
    resizeObserver.observe(document.documentElement);
  }

  close = (id: string) =>
    this.openWindows.update((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });

  open(id: string): void {
    this.openWindows.update((s) => new Set(s).add(id));
    this.bringToFront(id);
  }

  computeTaskbarPositions(): void {
    if (!this.taskBarButtons().length) return;

    const buttonElements = this.taskBarButtons().map((b) => b.nativeElement);
    const widths = buttonElements.map((b) => b.offsetWidth);
    const GAP_REM = 1;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const gap = GAP_REM * rem;
    const totalWidth = widths.reduce((s, w) => s + w, 0);
    const totalNatural = totalWidth + gap * (widths.length - 1);
    const RESERVED_PX = 18 * rem; // Width of the chat hint
    const availablePx = window.innerWidth - RESERVED_PX - gap;

    const positions: number[] = [];

    if (totalNatural <= availablePx) {
      // Flexbox-equivalent: stack from the right
      let cursor = gap;
      for (let i = widths.length - 1; i >= 0; i--) {
        positions[i] = cursor;
        cursor += widths[i] + gap;
      }
    } else {
      // Spread evenly across available space
      const totalGapSpace = availablePx - totalWidth;
      const actualGap = totalGapSpace / (widths.length - 1);
      let cursor = availablePx;
      for (let i = 0; i < widths.length; i++) {
        cursor -= widths[i];
        positions[i] = cursor + gap;
        cursor -= actualGap;
      }
    }

    this.taskbarButtonPositions.set(positions);
  }

  bringToFront(id: string): void {
    if (this.zIndices()[id] === this.zCounter) return;
    this.zIndices.update((z) => ({ ...z, [id]: ++this.zCounter }));
  }
}
