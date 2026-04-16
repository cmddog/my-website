import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  readonly isUser = computed<boolean>(() => this.identity().type === 'USER');

  refresh$(): Observable<MeResponse> {
    return this.http.get<MeResponse>('/api/auth/me', { withCredentials: true });
  }
}
