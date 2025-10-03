import {
  Component,
  inject,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
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
export class CommissionPageComponent implements AfterViewInit, OnDestroy {
  // --- Injections ---
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly publicInfoService = inject(PublicInfoService);

  @ViewChild('queueContainer') queueContainer!: ElementRef<HTMLDivElement>;

  protected readonly Array = Array;

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
    switchMap(() =>
      this.publicInfoService.getQueue().pipe(
        map((data) => ({ loading: false, data, error: null })),
        catchError((error) => of({ loading: false, data: null, error })),
        startWith({ loading: true, data: null, error: null }),
      ),
    ),
  );

  // --- Functions ---
  ngAfterViewInit(): void {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let lastTime = 0;
    let lastX = 0;
    let momentumId: number | null = null;

    const el = this.queueContainer.nativeElement;

    const updateCursor = () =>
      el.scrollWidth > el.clientWidth
        ? el.classList.add('grabby')
        : el.classList.remove('grabby');

    updateCursor();
    new ResizeObserver(updateCursor).observe(el);

    const mouseDown = (e: MouseEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      isDown = true;
      startX = e.pageX;
      scrollLeft = el.scrollLeft;
      velocity = 0;
      lastX = e.pageX;
      lastTime = performance.now();

      if (momentumId) cancelAnimationFrame(momentumId);
    };

    const mouseUp = () => {
      isDown = false;
      updateCursor();

      const el = this.queueContainer.nativeElement;
      const step = () => {
        if (Math.abs(velocity) < 0.001) return; // stop threshold

        el.scrollLeft += velocity * 16; // assume ~60fps → 16ms frame
        // friction
        velocity *= 0.95;

        momentumId = requestAnimationFrame(step);
      };
      momentumId = requestAnimationFrame(step);
    };

    const mouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();

      const x = e.pageX;
      const walk = x - startX;
      el.scrollLeft = scrollLeft - walk;

      // Velocity
      const now = performance.now();
      const delta = now - lastTime;
      velocity = (lastX - x) / delta;
      lastX = x;
      lastTime = now;
    };

    el.addEventListener('mousedown', mouseDown);
    el.addEventListener('mouseleave', mouseUp);
    el.addEventListener('mouseup', mouseUp);
    el.addEventListener('mousemove', mouseMove);

    this.cleanUpFns = [
      () => el.removeEventListener('mousedown', mouseDown),
      () => el.removeEventListener('mouseleave', mouseDown),
      () => el.removeEventListener('mouseup', mouseUp),
      () => el.removeEventListener('mousemove', mouseMove),
    ];
  }

  private cleanUpFns: (() => void)[] = [];

  retryQueue() {
    this.retryTrigger$.next();
  }

  ngOnDestroy(): void {
    this.cleanUpFns.forEach((fn) => fn());
  }
}
