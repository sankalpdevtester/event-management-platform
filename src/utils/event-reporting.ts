import { Injectable } from '@angular/core';
import { EventService } from '../services/event.service';
import { UserService } from '../services/user.service';
import { CacheManager } from '../utils/cache-manager';
import { EventAnalytics } from '../utils/event-analytics';

interface EventReport {
  eventId: string;
  eventName: string;
  eventType: string;
  attendees: number;
  revenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventReporting {

  private cacheManager: CacheManager;
  private eventService: EventService;
  private userService: UserService;
  private eventAnalytics: EventAnalytics;

  constructor(
    cacheManager: CacheManager,
    eventService: EventService,
    userService: UserService,
    eventAnalytics: EventAnalytics
  ) {
    this.cacheManager = cacheManager;
    this.eventService = eventService;
    this.userService = userService;
    this.eventAnalytics = eventAnalytics;
  }

  async generateEventReport(eventId: string): Promise<EventReport> {
    const cacheKey = `event-report-${eventId}`;
    const cachedReport = await this.cacheManager.get(cacheKey);
    if (cachedReport) {
      return cachedReport;
    }

    const event = await this.eventService.getEvent(eventId);
    const attendees = await this.userService.getAttendeesForEvent(eventId);
    const revenue = await this.eventService.getRevenueForEvent(eventId);

    const report: EventReport = {
      eventId: event.id,
      eventName: event.name,
      eventType: event.type,
      attendees: attendees.length,
      revenue: revenue
    };

    await this.cacheManager.set(cacheKey, report, 3600); // cache for 1 hour
    await this.eventAnalytics.logEventReport(report);

    return report;
  }

  async getEventReports(): Promise<EventReport[]> {
    const reports: EventReport[] = [];
    const events = await this.eventService.getEvents();
    for (const event of events) {
      const report = await this.generateEventReport(event.id);
      reports.push(report);
    }
    return reports;
  }
}