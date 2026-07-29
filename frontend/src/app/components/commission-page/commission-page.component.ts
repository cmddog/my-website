import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BreakpointService } from '@services';

@Component({
  selector: 'app-commission-page',
  imports: [AsyncPipe],
  templateUrl: './commission-page.component.html',
  styleUrl: './commission-page.component.scss',
})
export class CommissionPageComponent {
  readonly isHandsetPortrait$ = inject(BreakpointService).isMobile$;
}
