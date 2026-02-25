import {inject, Injectable} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, Observable, shareReplay} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  isMobile$(): Observable<boolean> {
    return this.breakpointObserver
      .observe(Breakpoints.HandsetPortrait)
      .pipe(
        map((result) => result.matches),
        shareReplay(),
      );
  }
}
