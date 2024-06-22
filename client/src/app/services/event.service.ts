import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  saveEvent(event: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, event);
  }
}
