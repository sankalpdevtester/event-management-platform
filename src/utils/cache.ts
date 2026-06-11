// src/utils/cache.ts
import { Injectable } from '@angular/core';
import { CacheItem } from './cache-item.interface';

interface CacheConfig {
  ttl: number; // time to live in seconds
}

const DEFAULT_TTL = 60; // 1 minute

class Cache {
  private cache: { [key: string]: CacheItem } = {};
  private config: CacheConfig;

  constructor(config: CacheConfig = { ttl: DEFAULT_TTL }) {
    this.config = config;
  }

  get(key: string): any {
    const item = this.cache[key];
    if (!item) {
      return null;
    }
    if (item.expired) {
      delete this.cache[key];
      return null;
    }
    return item.value;
  }

  set(key: string, value: any): void {
    const item: CacheItem = {
      value,
      expiresAt: Date.now() + this.config.ttl * 1000,
    };
    this.cache[key] = item;
  }

  delete(key: string): void {
    delete this.cache[key];
  }

  clear(): void {
    this.cache = {};
  }

  private checkExpiration(): void {
    const now = Date.now();
    Object.keys(this.cache).forEach((key) => {
      const item = this.cache[key];
      if (item.expiresAt < now) {
        delete this.cache[key];
      }
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache: Cache;

  constructor() {
    this.cache = new Cache();
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export interface CacheItem {
  value: any;
  expiresAt: number;
  expired: boolean;
}
``}
```typescript
// src/utils/cache-item.interface.ts
export interface CacheItem {
  value: any;
  expiresAt: number;
  expired: boolean;
}
``}
```typescript
// src/app/event-reminder/event-reminder.module.ts (update)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventReminderComponent } from './event-reminder.component';
import { CacheService } from '../utils/cache';

@NgModule({
  declarations: [EventReminderComponent],
  imports: [CommonModule],
  providers: [CacheService],
})
export class EventReminderModule {}
``}
```typescript
// src/app/event-schedule/event-schedule.module.ts (update)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventScheduleComponent } from './event-schedule.component';
import { CacheService } from '../utils/cache';

@NgModule({
  declarations: [EventScheduleComponent],
  imports: [CommonModule],
  providers: [CacheService],
})
export class EventScheduleModule {}
``}
```typescript
// src/utils/helpers.ts (update)
import { CacheService } from './cache';

export function getEventReminder(eventId: string): any {
  const cache = new CacheService();
  const cachedReminder = cache.get(`event-reminder-${eventId}`);
  if (cachedReminder) {
    return cachedReminder;
  }
  // fetch event reminder from API
  const reminder = fetchEventReminderFromAPI(eventId);
  cache.set(`event-reminder-${eventId}`, reminder);
  return reminder;
}

function fetchEventReminderFromAPI(eventId: string): any {
  // simulate API call
  return { eventId, reminder: 'Reminder for event ' + eventId };
}
``}