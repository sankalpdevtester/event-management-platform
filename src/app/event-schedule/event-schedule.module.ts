import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventScheduleComponent } from './event-schedule.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { EventService } from '../event.service';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: EventScheduleComponent }
];

@NgModule({
  declarations: [EventScheduleComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    RouterModule.forChild(routes)
  ],
  providers: [EventService]
})
export class EventScheduleModule { }

// EventScheduleComponent
import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { CalendarOptions, FullCalendarApi } from '@fullcalendar/angular';

@Component({
  selector: 'app-event-schedule',
  template: `
    <full-calendar
      [options]="calendarOptions"
      (eventClick)="handleEventClick($event)">
    </full-calendar>
  `
})
export class EventScheduleComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    events: []
  };

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(events => {
      this.calendarOptions.events = events.map(event => {
        return {
          title: event.name,
          start: event.startDate,
          end: event.endDate
        };
      });
    });
  }

  handleEventClick(event: any): void {
    console.log(event);
  }
}

// EventService
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = 'http://localhost:3000/api/events';

  constructor(private http: HttpClient) { }

  getEvents(): any {
    return this.http.get(this.apiUrl);
  }

  createEvent(event: any): any {
    return this.http.post(this.apiUrl, event);
  }

  updateEvent(event: any): any {
    return this.http.put(`${this.apiUrl}/${event.id}`, event);
  }

  deleteEvent(eventId: any): any {
    return this.http.delete(`${this.apiUrl}/${eventId}`);
  }
}