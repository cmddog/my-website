import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MeResponse } from './chat.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _identity = signal<MeResponse>({
    type: 'anonymous',
    displayName: null,
  });

  readonly identity = this._identity.asReadonly();
  readonly isUser = computed<boolean>(() => this.identity().type === 'user');

  refresh$(): Observable<MeResponse> {
    return this.http.get<MeResponse>('/api/auth/me', { withCredentials: true });
  }
}
