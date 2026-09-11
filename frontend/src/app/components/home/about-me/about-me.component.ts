import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { map, shareReplay } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ThemeService } from '@services';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-about-me',
  imports: [IconComponent, NgOptimizedImage, AsyncPipe],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss',
  standalone: true,
})
export class AboutMeComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly showNsfwToggle = !!localStorage.getItem('show-nsfw');

  protected readonly showNsfw = signal(false);

  private readonly breakpointObserver = inject(BreakpointObserver);
  protected readonly sizeDynamic$ = this.breakpointObserver
    .observe([`(max-width: 47.5rem)`])
    .pipe(
      map((result) => result.matches),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
}
