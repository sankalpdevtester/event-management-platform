import { Injectable } from '@angular/core';
import { Event } from '../models/event.model';
import { UserService } from '../services/user.service';
import { EventService } from '../services/event.service';

interface EventValidationResult {
  isValid: boolean;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EventValidation {

  private eventSchema = {
    title: {
      required: true,
      minLength: 5,
      maxLength: 100
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 500
    },
    startDate: {
      required: true,
      format: 'date'
    },
    endDate: {
      required: true,
      format: 'date'
    },
    location: {
      required: true,
      minLength: 5,
      maxLength: 100
    },
    organizer: {
      required: true,
      minLength: 5,
      maxLength: 100
    }
  };

  constructor(private userService: UserService, private eventService: EventService) { }

  validateEvent(event: Event): EventValidationResult {
    const errors: string[] = [];
    let isValid = true;

    if (!event.title || event.title.length < this.eventSchema.title.minLength || event.title.length > this.eventSchema.title.maxLength) {
      errors.push('Title must be between 5 and 100 characters');
      isValid = false;
    }

    if (!event.description || event.description.length < this.eventSchema.description.minLength || event.description.length > this.eventSchema.description.maxLength) {
      errors.push('Description must be between 10 and 500 characters');
      isValid = false;
    }

    if (!event.startDate || !this.isValidDate(event.startDate)) {
      errors.push('Start date must be a valid date');
      isValid = false;
    }

    if (!event.endDate || !this.isValidDate(event.endDate)) {
      errors.push('End date must be a valid date');
      isValid = false;
    }

    if (!event.location || event.location.length < this.eventSchema.location.minLength || event.location.length > this.eventSchema.location.maxLength) {
      errors.push('Location must be between 5 and 100 characters');
      isValid = false;
    }

    if (!event.organizer || event.organizer.length < this.eventSchema.organizer.minLength || event.organizer.length > this.eventSchema.organizer.maxLength) {
      errors.push('Organizer must be between 5 and 100 characters');
      isValid = false;
    }

    return { isValid, errors };
  }

  private isValidDate(date: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  }

  async validateEventOrganizer(event: Event): Promise<EventValidationResult> {
    const organizer = await this.userService.getUser(event.organizer);
    if (!organizer) {
      return { isValid: false, errors: ['Organizer not found'] };
    }
    return { isValid: true, errors: [] };
  }

  async validateEventDuplicates(event: Event): Promise<EventValidationResult> {
    const existingEvent = await this.eventService.getEventByTitle(event.title);
    if (existingEvent) {
      return { isValid: false, errors: ['Event with the same title already exists'] };
    }
    return { isValid: true, errors: [] };
  }
}