import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Event } from '../models/event';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events`, httpOptions)
      .pipe(
        tap(_ => console.log('fetched events')),
        catchError(this.handleError<Event[]>('getEvents', []))
      );
  }

  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/events/${id}`, httpOptions)
      .pipe(
        tap(_ => console.log(`fetched event id=${id}`)),
        catchError(this.handleError<Event>(`getEvent id=${id}`))
      );
  }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/events`, event, httpOptions)
      .pipe(
        tap((newEvent: Event) => console.log(`created event w/ id=${newEvent.id}`)),
        catchError(this.handleError<Event>('createEvent'))
      );
  }

  updateEvent(event: Event): Observable<any> {
    return this.http.put(`${this.apiUrl}/events/${event.id}`, event, httpOptions)
      .pipe(
        tap(_ => console.log(`updated event id=${event.id}`)),
        catchError(this.handleError<any>('updateEvent'))
      );
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/events/${id}`, httpOptions)
      .pipe(
        tap(_ => console.log(`deleted event id=${id}`)),
        catchError(this.handleError<any>('deleteEvent'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getEventsForUser(): Observable<Event[]> {
    const userId = this.userService.getCurrentUser().id;
    return this.http.get<Event[]>(`${this.apiUrl}/users/${userId}/events`, httpOptions)
      .pipe(
        tap(_ => console.log('fetched events for user')),
        catchError(this.handleError<Event[]>('getEventsForUser', []))
      );
  }
}