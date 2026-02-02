import {AfterViewInit, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {BreakpointService} from '@services';
import {AboutMeComponent} from '../about-me/about-me.component';
import {GalleryComponent} from '../gallery/gallery.component';

enum Options {
  Commissions = 0,
  AboutMe = 1,
  Gallery = 2,
}

@Component({
  selector: 'app-tabs',
  imports: [AsyncPipe, AboutMeComponent, GalleryComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  protected readonly breakpointService = inject(BreakpointService);
  protected readonly tabs: Options[] = [Options.Commissions, Options.AboutMe, Options.Gallery];
  protected readonly Options = Options;

  loadedTabs: Set<Options> = new Set<Options>([Options.AboutMe]);
  currentTab: Options = Options.AboutMe;

  selectTab(tab: Options) {
    if (tab === this.currentTab) return;

    this.loadedTabs.add(tab);
    this.currentTab = tab;
  }

  getTabName(tab: Options): string {
    return ['Commissions', 'About Me', 'Gallery'][tab];
  }
}
