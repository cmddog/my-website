import {Component, inject} from '@angular/core';
import {LoginService} from '@services';
import {Router} from '@angular/router';
import {noop} from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router)

  constructor() {
    this.loginService.verify().subscribe({
      error: _ => {
        this.router.navigate(['admin']).then(noop)
      }
    })
  }
}
