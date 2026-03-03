import {Component, signal} from '@angular/core';
import {AboutMeComponent} from './about-me/about-me.component';
import {DraggableContainerComponent} from '../draggable-container/draggable-container.component';
import {ChangelogComponent} from './changelog/changelog.component';

@Component({
  selector: 'app-home',
  imports: [
    AboutMeComponent,
    DraggableContainerComponent,
    ChangelogComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly windows = new Map([
    ['introduction', 'Introduction'],
    ['changelog', 'Changelog'],
  ]);

  readonly openWindows = signal(new Set(['introduction']));

  close = (id: string) => this.openWindows.update(s => { const n = new Set(s); n.delete(id); return n; });
  open  = (id: string) => this.openWindows.update(s => new Set(s).add(id));
}
