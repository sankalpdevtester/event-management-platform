import { Injectable } from '@angular/core';
import { CacheItem } from './cache-item';

interface CacheConfig {
  ttl: number; // time to live in seconds
}

class CacheManager {
  private cache: { [key: string]: CacheItem } = {};
  private config: CacheConfig;

  constructor(config: CacheConfig) {
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
    const item = new CacheItem(value, this.config.ttl);
    this.cache[key] = item;
  }

  delete(key: string): void {
    delete this.cache[key];
  }

  clear(): void {
    this.cache = {};
  }
}

class CacheItem {
  value: any;
  expired: boolean;
  private ttl: number;
  private createdAt: number;

  constructor(value: any, ttl: number) {
    this.value = value;
    this.ttl = ttl;
    this.createdAt = Date.now();
    this.expired = false;
  }

  checkExpired(): void {
    const now = Date.now();
    if (now - this.createdAt > this.ttl * 1000) {
      this.expired = true;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cacheManager: CacheManager;

  constructor() {
    const config: CacheConfig = {
      ttl: 60 // 1 minute
    };
    this.cacheManager = new CacheManager(config);
  }

  getCache(key: string): any {
    return this.cacheManager.get(key);
  }

  setCache(key: string, value: any): void {
    this.cacheManager.set(key, value);
  }

  deleteCache(key: string): void {
    this.cacheManager.delete(key);
  }

  clearCache(): void {
    this.cacheManager.clear();
  }
}
``}
```typescript
// example usage in event.service.ts
import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private cacheService: CacheService;

  constructor(private cacheService: CacheService) { }

  getEvents(): any {
    const cachedEvents = this.cacheService.getCache('events');
    if (cachedEvents) {
      return cachedEvents;
    }
    // fetch events from API
    const events = fetchEventsFromAPI();
    this.cacheService.setCache('events', events);
    return events;
  }
}
``}