import {Component, inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginService} from '../../services/login.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, EMPTY, noop, of, throwError} from 'rxjs';
import {finalize} from 'rxjs/operators';

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
  protected isLoading = false;

  constructor() {
    if (localStorage.getItem('adminRedirect')) this.router.navigate(['/']).then(noop);

    this.loginService.verify().pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          return EMPTY;
        }
        return throwError(() => err);
      })
    ).subscribe(_ => this.router.navigate(['/admin/dashboard']))
  }

  protected submit(): void {
    this.isLoading = true;
    this.password.disable();

    this.loginService.login(this.password.value).pipe(
      finalize(() => {
        this.isLoading = false;
        this.password.enable();
      })
    ).subscribe({
      next: _ => {
        this.router.navigate(['/admin/dashboard']).then(noop);
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
