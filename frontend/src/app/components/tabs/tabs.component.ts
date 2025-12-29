import { Component } from '@angular/core';
import { AboutMeComponent } from '../about-me/about-me.component';

enum Options {
  Commissions = 'Commissions',
  AboutMe = 'About Me',
  Gallery = 'Gallery',
}

@Component({
  selector: 'app-tabs',
  imports: [AboutMeComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  protected readonly tabs = Object.values(Options);

  protected selected = Options.AboutMe;
}
