import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService, ChatService } from '@services';
import { DraggableContainerComponent } from '../../draggable-container/draggable-container.component';

/** Validates that the `password` and `confirmPassword` controls match. */
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-account-forms',
  imports: [ReactiveFormsModule, DraggableContainerComponent],
  templateUrl: './account-forms.component.html',
  styleUrl: './account-forms.component.scss',
})
export class AccountFormsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly chat = inject(ChatService);

  readonly loggingIn = signal(false);
  readonly registering = signal(false);
  readonly isLoading = signal(false);
  readonly loginError = signal('');
  readonly registerError = signal('');

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  readonly registerForm = this.fb.nonNullable.group(
    {
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      securityQuestion: [''],
      securityAnswer: [''],
    },
    { validators: passwordsMatch },
  );

  openLogin(): void {
    this.registering.set(false);
    this.loginError.set('');
    this.loggingIn.set(true);
  }

  openRegister(): void {
    this.loggingIn.set(false);
    this.registerError.set('');
    this.registering.set(true);
  }

  closeLogin(): void {
    this.loggingIn.set(false);
    this.loginError.set('');
  }

  closeRegister(): void {
    this.registering.set(false);
    this.registerError.set('');
  }

  logIn(): void {
    if (this.isLoading() || this.loginForm.invalid) return;
    this.isLoading.set(true);

    const { username, password } = this.loginForm.getRawValue();
    this.auth
      .login$(username, password)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.loginError.set('');
          this.loggingIn.set(false);
          this.chat.pushServerMessage('Logged in successfully', 'green');
        },
        error: (e: HttpErrorResponse) =>
          this.loginError.set(e.error?.message ?? 'An error occurred'),
      });
  }

  register(): void {
    if (this.isLoading() || this.registerForm.invalid) {
      if (this.registerForm.hasError('passwordMismatch'))
        this.registerError.set('Passwords must equal');
      return;
    }
    this.isLoading.set(true);

    const { username, password, securityQuestion, securityAnswer } =
      this.registerForm.getRawValue();
    this.auth
      .register$(username, password, securityQuestion, securityAnswer)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.registerError.set('');
          this.registering.set(false);
          this.chat.pushServerMessage(
            'Registered and logged in successfully',
            'green',
          );
        },
        error: (e: HttpErrorResponse) =>
          this.registerError.set(e.error?.message ?? 'An error occurred'),
      });
  }
}
