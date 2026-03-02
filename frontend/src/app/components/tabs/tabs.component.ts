import {AfterViewInit, Component, ElementRef, inject, output, ViewChild} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {BreakpointService} from '@services';
import {AboutMeComponent} from '../home/about-me/about-me.component';
import {HomeComponent} from '../home/home.component';

enum Option {
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
  protected readonly tabs: Option[] = [Option.Commissions, Option.Home, Option.Creations];
  protected readonly Options = Option;

  loadedTabs: Set<Option> = new Set<Option>([Option.Home]);
  currentTab: Option = Option.Home;


  selectTab(tab: Option) {
    if (tab === this.currentTab) return;

    this.loadedTabs.add(tab);
    this.currentTab = tab;
  }

  getTabName(tab: Option): string {
    return ['Commissions', 'Home', 'Creations'][tab];
  }
}
