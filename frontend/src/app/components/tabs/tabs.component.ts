import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BreakpointService, ThemeService } from '@services';
import { HomeComponent } from '../home/home.component';
import { DraggableContainerComponent } from '../draggable-container/draggable-container.component';

enum Option {
  Commissions = 0,
  Home = 1,
  Gallery = 2,
}

@Component({
  selector: 'app-tabs',
  imports: [AsyncPipe, HomeComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {
  loadedTabs: Set<Option> = new Set<Option>([Option.Home]);
  currentTab: Option = Option.Home;
  protected readonly breakpointService = inject(BreakpointService);
  protected readonly tabs: Option[] = [Option.Commissions, Option.Home, Option.Gallery];
  protected readonly Options = Option;

  constructor() {
    if (localStorage.getItem('colour-swap')) {
      inject(ThemeService).toggle(true);
    }
  }

  selectTab(tab: Option) {
    if (tab === this.currentTab) return;

    this.loadedTabs.add(tab);
    this.currentTab = tab;
  }

  getTabName(tab: Option): string {
    return ['Commissions', 'Home', 'Gallery'][tab];
  }
}
