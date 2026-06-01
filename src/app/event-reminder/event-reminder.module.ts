import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventReminderComponent } from './event-reminder.component';
import { EventReminderService } from './event-reminder.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: '', component: EventReminderComponent }
];

@NgModule({
  declarations: [EventReminderComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [EventReminderService]
})
export class EventReminderModule { }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventReminderService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  sendReminder(eventId: string, userId: string) {
    const url = `${this.apiUrl}/events/${eventId}/reminders`;
    const data = { userId };
    return this.http.post(url, data);
  }

}

import { Component, OnInit } from '@angular/core';
import { EventReminderService } from './event-reminder.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-event-reminder',
  template: `
    <div class="container">
      <h1>Event Reminder</h1>
      <form [formGroup]="reminderForm">
        <div class="form-group">
          <label for="eventId">Event ID:</label>
          <input type="text" id="eventId" formControlName="eventId" class="form-control">
        </div>
        <div class="form-group">
          <label for="userId">User ID:</label>
          <input type="text" id="userId" formControlName="userId" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary" (click)="sendReminder()">Send Reminder</button>
      </form>
    </div>
  `
})
export class EventReminderComponent implements OnInit {

  reminderForm: FormGroup;

  constructor(private eventReminderService: EventReminderService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.reminderForm = new FormGroup({
      eventId: new FormControl('', Validators.required),
      userId: new FormControl('', Validators.required)
    });
  }

  sendReminder() {
    const eventId = this.reminderForm.get('eventId').value;
    const userId = this.reminderForm.get('userId').value;
    this.eventReminderService.sendReminder(eventId, userId).subscribe((response) => {
      console.log(response);
    });
  }

}