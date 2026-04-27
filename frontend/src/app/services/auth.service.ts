import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface MeResponse {
  type: 'USER' | 'GUEST' | 'ANONYMOUS';
  displayName: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _identity = signal<MeResponse>({
    type: 'ANONYMOUS',
    displayName: null,
  });

  readonly identity = this._identity.asReadonly();
  readonly isLoggedIn = computed<boolean>(
    () => this.identity().type === 'USER',
  );

  refresh(): void {
    this.http
      .get<MeResponse>('/api/auth/me', { withCredentials: true })
      .subscribe((res) => this._identity.set(res));
  }

  login$(username: string, password: string): Observable<never> {
    return this.http
      .post<never>(
        '/api/auth/login',
        { username, password },
        { withCredentials: true },
      )
      .pipe(
        tap(() => this._identity.set({ type: 'USER', displayName: username })),
      );
  }

  register$(
    username: string,
    password: string,
    securityQuestion: string,
    securityAnswer: string,
  ): Observable<never> {
    return this.http
      .post<never>(
        '/api/auth/register',
        {
          username,
          password,
          securityQuestion,
          securityAnswer,
        },
        { withCredentials: true },
      )
      .pipe(
        tap(() => this._identity.set({ type: 'USER', displayName: username })),
      );
  }

  logout$(): Observable<never> {
    return this.http
      .post<never>('/api/auth/logout', { withCredentials: true })
      .pipe(
        tap(() => this._identity.set({ type: 'ANONYMOUS', displayName: null })),
      );
  }
}
