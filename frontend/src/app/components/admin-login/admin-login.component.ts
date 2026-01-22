import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { noop } from 'rxjs';

@Component({
  selector: 'app-admin-login',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  protected readonly password = new FormControl;

  constructor() {
    if (localStorage.getItem('adminRedirect')) this.router.navigate(['/']).then(noop);
  }

  protected submit(): void {
    this.loginService.login(this.password.value).subscribe({
      next: _ => {
        window.alert('success');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          localStorage.setItem('adminRedirect', 'true');
          this.router.navigate(['/']).then(noop);
        } else {
          console.log(err.message);
        }
      }
    });
  }
}
