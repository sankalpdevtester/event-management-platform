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
    if (item.expiration < Date.now()) {
      delete this.cache[key];
      return null;
    }
    return item.value;
  }

  set(key: string, value: any): void {
    const expiration = Date.now() + this.config.ttl * 1000;
    this.cache[key] = { value, expiration };
  }

  delete(key: string): void {
    delete this.cache[key];
  }

  clear(): void {
    this.cache = {};
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

  getCache(): Cache {
    return this.cache;
  }

  getConfig(): CacheConfig {
    return this.cache.config;
  }

  setConfig(config: CacheConfig): void {
    this.cache.config = config;
  }
}

export interface CacheItem {
  value: any;
  expiration: number;
}
``}

// src/utils/cache-item.interface.ts
```typescript
// src/utils/cache-item.interface.ts
export interface CacheItem {
  value: any;
  expiration: number;
}
``}

// src/app/event-schedule/event-schedule.module.ts (example usage)
```typescript
// src/app/event-schedule/event-schedule.module.ts
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

// src/app/event-schedule/event-schedule.component.ts (example usage)
```typescript
// src/app/event-schedule/event-schedule.component.ts
import { Component, OnInit } from '@angular/core';
import { CacheService } from '../utils/cache';

@Component({
  selector: 'app-event-schedule',
  template: '<p>Event Schedule</p>',
})
export class EventScheduleComponent implements OnInit {
  constructor(private cacheService: CacheService) {}

  ngOnInit(): void {
    const cache = this.cacheService.getCache();
    cache.set('eventSchedule', 'some data');
    console.log(cache.get('eventSchedule')); // outputs: some data
  }
}
``}