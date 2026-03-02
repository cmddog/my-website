import {AfterViewInit, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {BreakpointService} from '@services';
import {AboutMeComponent} from '../home/about-me/about-me.component';
import {HomeComponent} from '../home/home.component';

enum Options {
  Commissions = 0,
  Home = 1,
  Creations = 2,
}

@Component({
  selector: 'app-tabs',
  imports: [AsyncPipe, HomeComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  protected readonly breakpointService = inject(BreakpointService);
  protected readonly tabs: Options[] = [Options.Commissions, Options.Home, Options.Creations];
  protected readonly Options = Options;

  loadedTabs: Set<Options> = new Set<Options>([Options.Home]);
  currentTab: Options = Options.Home;

  selectTab(tab: Options) {
    if (tab === this.currentTab) return;

    this.loadedTabs.add(tab);
    this.currentTab = tab;
  }

  getTabName(tab: Options): string {
    return ['Commissions', 'Home', 'Creations'][tab];
  }
}
