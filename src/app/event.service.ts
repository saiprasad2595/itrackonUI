import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICreateEvent } from './app.model';
@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }
  createEvent(body: ICreateEvent) {
    console.log('body', body);
    const url = 'http://localhost:3000/v1/calendar/createEvent';
    return this.http.post(url, body);
  }
}
