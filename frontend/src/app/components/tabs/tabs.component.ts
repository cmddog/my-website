import { Component, inject } from '@angular/core';
import { AboutMeComponent } from '../about-me/about-me.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {BreakpointService} from '../../services/breakpoint.service';

enum Options {
  Commissions = 'Commissions',
  AboutMe = 'About Me',
  Gallery = 'Gallery',
}

@Component({
  selector: 'app-tabs',
  imports: [AsyncPipe],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  protected readonly breakpointService = inject(BreakpointService);
  protected readonly tabs = Object.values(Options);
  protected readonly Options = Options;
  protected selected = Options.AboutMe;
}
