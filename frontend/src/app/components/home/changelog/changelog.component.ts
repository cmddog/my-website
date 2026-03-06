import { Component } from '@angular/core';
import { ChangelogEntryComponent } from './changelog-entry/changelog-entry.component';
import planned from './planned.json';
import changelog from './changelog.json';

@Component({
  selector: 'app-changelog',
  imports: [
    ChangelogEntryComponent
  ],
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.scss'
})
export class ChangelogComponent {
  protected readonly planned = planned;
  protected readonly changelog = changelog;
}
