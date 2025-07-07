import {Component, inject} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-commission-page',
  imports: [AsyncPipe],
  templateUrl: './commission-page.component.html',
  styleUrl: './commission-page.component.css',
})
export class CommissionPageComponent {
  private breakpointObserver = inject(BreakpointObserver);
  readonly isHandsetPortrait$ = this.breakpointObserver
    .observe([Breakpoints.HandsetPortrait])
    .pipe(
      map((result) => result.matches),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
}
