import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-commission-page',
  imports: [AsyncPipe],
  templateUrl: './commission-page.component.html',
  styleUrl: './commission-page.component.scss',
})
export class CommissionPageComponent {
  private breakpointObserver = inject(BreakpointObserver);
  protected themeService = inject(ThemeService);
  readonly isHandsetPortrait$ = this.breakpointObserver
    .observe([Breakpoints.HandsetPortrait])
    .pipe(
      map((result) => result.matches),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
}
