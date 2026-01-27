import {AfterViewInit, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {catchError, map, of, startWith, Subject, switchMap} from 'rxjs';
import {PublicInfoService} from '@services';
import {BreakpointService} from '../../services/breakpoint.service';
import {AsyncPipe} from '@angular/common';
import {SkeletonLoaderComponent} from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-queue',
  imports: [
    AsyncPipe,
    SkeletonLoaderComponent
  ],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.scss'
})
export class QueueComponent implements AfterViewInit {
  protected readonly Array = Array;

  private readonly publicInfoService = inject(PublicInfoService);
  protected readonly breakpointService = inject(BreakpointService);

  @ViewChild('queueContainer') queueContainer!: ElementRef<HTMLDivElement>;

  private readonly retryTrigger$ = new Subject<void>();
  readonly queue$ = this.retryTrigger$.pipe(
    startWith(null),
    switchMap(() =>
      this.publicInfoService.getQueue().pipe(
        map((data) => ({loading: false, data, error: null})),
        catchError((error) => of({loading: false, data: null, error})),
        startWith({loading: true, data: null, error: null}),
      ),
    ),
  );

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
