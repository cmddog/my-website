import { Component, inject } from '@angular/core';
import { AboutMeComponent } from '../about-me/about-me.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { AsyncPipe } from '@angular/common';

enum Options {
  Commissions = 'Commissions',
  AboutMe = 'About Me',
  Gallery = 'Gallery',
}

@Component({
  selector: 'app-tabs',
  imports: [AboutMeComponent, AsyncPipe],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  protected readonly tabs = Object.values(Options);
  protected readonly Options = Options;

  private readonly breakpointObserver = inject(BreakpointObserver);

  protected selected = Options.AboutMe;
  protected isMobile$ = this.breakpointObserver
    .observe(Breakpoints.HandsetPortrait)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );
}
