import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { map, shareReplay } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ThemeService } from '@services';

@Component({
  selector: 'app-about-me',
  imports: [NgOptimizedImage, AsyncPipe],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss'
})
export class AboutMeComponent {
  protected readonly themeService = inject(ThemeService);

  private readonly breakpointObserver = inject(BreakpointObserver);
  protected readonly sizeDynamic$ = this.breakpointObserver
    .observe([`(max-width: 47.5rem)`])
    .pipe(
      map((result) => result.matches),
      shareReplay({ bufferSize: 1, refCount: true })
    );
}
