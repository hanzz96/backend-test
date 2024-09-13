import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheLockException } from 'src/_exception/cache_lock.exception';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  // Method to check and set cache lock
  async lockCache(key: string, value: any, ttl: number = 3000, failedMessage: string, silent: boolean = false): Promise<void> {
    const existingValue = await this.cacheManager.get(key);
    if (existingValue !== undefined) {
      throw new CacheLockException(failedMessage);
    }
    await this.cacheManager.set(key, value, ttl );
  }

  async silentLockCache(key: string, value: any, ttl: number = 3000, failedMessage: string): Promise<void> {
    await this.cacheManager.set(key, value, ttl );
  }
  // Method to unlock cache
  async unlockCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async getCache<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get<T>(key);
  }

  async delCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
