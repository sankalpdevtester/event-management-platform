// src/utils/cache.ts
import { Injectable } from '@angular/core';
import { CacheItem } from './cache-item.interface';

interface CacheConfig {
  ttl: number; // time to live in milliseconds
}

const DEFAULT_TTL = 60 * 1000; // 1 minute

class Cache {
  private cache: Map<string, CacheItem>;
  private config: CacheConfig;

  constructor(config: CacheConfig = { ttl: DEFAULT_TTL }) {
    this.cache = new Map();
    this.config = config;
  }

  get(key: string): any {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }
    if (item.expiration < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key: string, value: any): void {
    const expiration = Date.now() + this.config.ttl;
    this.cache.set(key, { value, expiration });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
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

  setTTL(ttl: number): void {
    this.cache = new Cache({ ttl });
  }
}

// Example usage:
// const cacheService = new CacheService();
// cacheService.getCache().set('apiResponse', { data: 'example data' });
// const cachedResponse = cacheService.getCache().get('apiResponse');
// console.log(cachedResponse); // { data: 'example data' }

// src/app/event-reminder/event-reminder.module.ts
// import { CacheService } from '../utils/cache';
// @NgModule({
//   ...
//   providers: [CacheService],
// })
// export class EventReminderModule {}

// src/services/event.service.ts
// import { CacheService } from '../utils/cache';
// @Injectable({
//   providedIn: 'root',
// })
// export class EventService {
//   constructor(private cacheService: CacheService) {}
//   getEvents(): Observable<any> {
//     const cachedResponse = this.cacheService.getCache().get('events');
//     if (cachedResponse) {
//       return of(cachedResponse);
//     }
//     return this.http.get('https://example.com/api/events').pipe(
//       tap((response) => {
//         this.cacheService.getCache().set('events', response);
//       }),
//     );
//   }
// }