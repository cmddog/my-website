import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = '/api';

  login(password: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/admin/login`, { password: password }, { withCredentials: true });
  }
}
