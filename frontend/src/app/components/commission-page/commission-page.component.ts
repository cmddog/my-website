import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay, catchError, startWith, switchMap } from 'rxjs';
import { of, Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { PublicInfoService } from '@services';

@Component({
  selector: 'app-commission-page',
  imports: [AsyncPipe, SkeletonLoaderComponent],
  templateUrl: './commission-page.component.html',
  styleUrl: './commission-page.component.scss',
})
export class CommissionPageComponent {
  // --- Injections ---
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly publicInfoService = inject(PublicInfoService);

  // --- Variables ---
  readonly isHandsetPortrait$ = this.breakpointObserver
    .observe([Breakpoints.HandsetPortrait])
    .pipe(
      map((result) => result.matches),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  private readonly retryTrigger$ = new Subject<void>();

  readonly queue$ = this.retryTrigger$.pipe(
    startWith(null),
    switchMap(() => this.publicInfoService.getQueue().pipe(
      map(data => ({ loading: false, data, error: null })),
      catchError(error => of({ loading: false, data: null, error })),
      startWith({ loading: true, data: null, error: null })
    ))
  );

  retryQueue() {
    this.retryTrigger$.next();
  }

  protected readonly Array = Array;
}
