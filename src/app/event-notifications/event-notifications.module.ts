import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventNotificationsComponent } from './event-notifications.component';
import { EventNotificationsService } from './event-notifications.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: EventNotificationsComponent
  }
];

@NgModule({
  declarations: [EventNotificationsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [EventNotificationsService]
})
export class EventNotificationsModule { }

// EventNotificationsComponent
import { Component, OnInit } from '@angular/core';
import { EventNotificationsService } from './event-notifications.service';

@Component({
  selector: 'app-event-notifications',
  template: `
    <div class="container">
      <h1>Event Notifications</h1>
      <form [formGroup]="notificationForm">
        <div class="form-group">
          <label for="eventName">Event Name:</label>
          <input type="text" id="eventName" formControlName="eventName" class="form-control">
        </div>
        <div class="form-group">
          <label for="notificationMessage">Notification Message:</label>
          <textarea id="notificationMessage" formControlName="notificationMessage" class="form-control"></textarea>
        </div>
        <button type="submit" class="btn btn-primary" (click)="sendNotification()">Send Notification</button>
      </form>
    </div>
  `
})
export class EventNotificationsComponent implements OnInit {
  notificationForm: any;

  constructor(private eventNotificationsService: EventNotificationsService) { }

  ngOnInit(): void {
    this.notificationForm = new FormGroup({
      eventName: new FormControl(''),
      notificationMessage: new FormControl('')
    });
  }

  sendNotification(): void {
    this.eventNotificationsService.sendNotification(this.notificationForm.value).subscribe((response: any) => {
      console.log(response);
    });
  }
}

// EventNotificationsService
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventNotificationsService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  sendNotification(notification: any): any {
    return this.http.post(`${this.apiUrl}/notifications`, notification);
  }
}

// API Endpoint
// src/app/api/notifications.ts
import { Router, Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { sendEmail } from '../utils/helpers';

const router = Router();
const mongoClient = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

router.post('/notifications', async (req: Request, res: Response) => {
  try {
    const notification = req.body;
    const db = mongoClient.db();
    const eventsCollection = db.collection('events');
    const event = await eventsCollection.findOne({ name: notification.eventName });
    if (event) {
      const attendees = event.attendees;
      attendees.forEach((attendee: any) => {
        sendEmail(attendee.email, notification.notificationMessage);
      });
      res.status(200).send({ message: 'Notification sent successfully' });
    } else {
      res.status(404).send({ message: 'Event not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

export default router;