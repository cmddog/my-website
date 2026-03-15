import { Component, inject, signal } from '@angular/core';
import { AboutMeComponent } from './about-me/about-me.component';
import { DraggableContainerComponent } from '../draggable-container/draggable-container.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { NeighbourhoodComponent } from './neighbourhood/neighbourhood.component';
import { SettingsComponent } from './settings/settings.component';
import { BreakpointService } from '@services';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    AboutMeComponent,
    DraggableContainerComponent,
    ChangelogComponent,
    NeighbourhoodComponent,
    SettingsComponent,
    AsyncPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // tmp
  protected readonly breakpointService = inject(BreakpointService);

  readonly windows = new Map([
    ['introduction', 'Introduction'],
    ['changelog', 'Changelog'],
    ['neighbourhood', 'Neighbourhood'],
    ['settings', 'Settings']
  ]);

  private zCounter = 0;
  readonly zIndices = signal<Record<string, number>>({});

  readonly openWindows = signal(new Set(['introduction']));

  close = (id: string) => this.openWindows.update(s => {
    const n = new Set(s);
    n.delete(id);
    return n;
  });

  open(id: string): void {
    this.openWindows.update(s => new Set(s).add(id));
    this.bringToFront(id);
  }

  bringToFront(id: string): void {
    if (this.zIndices()[id] === this.zCounter) return;
    this.zIndices.update(z => ({ ...z, [id]: ++this.zCounter }));
  }
}
