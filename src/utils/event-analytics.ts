import { Injectable } from '@angular/core';
import { Event } from '../models/event';
import { UserService } from '../services/user.service';
import { EventService } from '../services/event.service';

@Injectable({
  providedIn: 'root'
})
export class EventAnalytics {

  private engagementMetrics: { [eventId: string]: any } = {};

  constructor(private userService: UserService, private eventService: EventService) { }

  trackEventView(eventId: string): void {
    this.updateEngagementMetric(eventId, 'views', 1);
  }

  trackEventRegistration(eventId: string, userId: string): void {
    this.updateEngagementMetric(eventId, 'registrations', 1);
    this.userService.getUser(userId).subscribe(user => {
      this.eventService.getEvent(eventId).subscribe(event => {
        this.updateUserEventEngagement(user, event);
      });
    });
  }

  trackEventShare(eventId: string): void {
    this.updateEngagementMetric(eventId, 'shares', 1);
  }

  private updateEngagementMetric(eventId: string, metric: string, increment: number): void {
    if (!this.engagementMetrics[eventId]) {
      this.engagementMetrics[eventId] = {};
    }
    if (!this.engagementMetrics[eventId][metric]) {
      this.engagementMetrics[eventId][metric] = 0;
    }
    this.engagementMetrics[eventId][metric] += increment;
  }

  private updateUserEventEngagement(user: any, event: Event): void {
    const userEventEngagement = {
      userId: user.id,
      eventId: event.id,
      views: this.engagementMetrics[event.id].views || 0,
      registrations: this.engagementMetrics[event.id].registrations || 0,
      shares: this.engagementMetrics[event.id].shares || 0
    };
    this.eventService.updateUserEventEngagement(userEventEngagement).subscribe();
  }

  getEventEngagement(eventId: string): any {
    return this.engagementMetrics[eventId];
  }

  getAllEventsEngagement(): { [eventId: string]: any } {
    return this.engagementMetrics;
  }
}
```
```typescript
// Example usage in user-registration.component.ts
import { Component, OnInit } from '@angular/core';
import { EventAnalytics } from '../utils/event-analytics';

@Component({
  selector: 'app-user-registration',
  template: '<p>user-registration works!</p>'
})
export class UserRegistrationComponent implements OnInit {

  constructor(private eventAnalytics: EventAnalytics) { }

  ngOnInit(): void {
    this.eventAnalytics.trackEventView('event-123');
    this.eventAnalytics.trackEventRegistration('event-123', 'user-123');
    this.eventAnalytics.trackEventShare('event-123');
  }
}
```
```typescript
// Example usage in event.service.ts
import { Injectable } from '@angular/core';
import { EventAnalytics } from '../utils/event-analytics';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private eventAnalytics: EventAnalytics) { }

  getEvent(eventId: string): any {
    // ...
    this.eventAnalytics.trackEventView(eventId);
    // ...
  }

  registerUserForEvent(eventId: string, userId: string): any {
    // ...
    this.eventAnalytics.trackEventRegistration(eventId, userId);
    // ...
  }

  shareEvent(eventId: string): any {
    // ...
    this.eventAnalytics.trackEventShare(eventId);
    // ...
  }
}