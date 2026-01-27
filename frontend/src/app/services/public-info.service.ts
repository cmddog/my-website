import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { QueueItem } from '@types';

@Injectable({
  providedIn: 'root',
})
export class PublicInfoService {
  private readonly http = inject(HttpClient);

  private baseUrl = '/api';

  getQueue(): Observable<QueueItem[]> {
    // return of([
    //   {clientName: "Goobert", commissionTypes: ["Reference Sheet"], status: "Awaiting Review", position: "1"},
    //   {clientName: "Slimbo", commissionTypes: ["Half-Body", "Three Characters", "Sketch"], status: "In Progress", position: "1"},
    //   {clientName: "Robert", commissionTypes: ["Full-Body", "One Character", "Fully Rendered"], status: "In Progress", position: "1"},
    //   {clientName: "Gleeby", commissionTypes: ["Bust", "Two Characters", "AO Shading"], status: "Awaiting Payment", position: "1"},
    // ])
    return this.http.get<QueueItem[]>(`${this.baseUrl}/queue`);
  }
}
