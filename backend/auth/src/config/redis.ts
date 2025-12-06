import Redis from 'ioredis';
import { logger } from '../utils/logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_DB = process.env.REDIS_DB || '0';

export const redisClient = new Redis(REDIS_URL, {
  password: REDIS_PASSWORD,
  db: parseInt(REDIS_DB),
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  family: 4, // 4 (IPv4) or 6 (IPv6)
  connectTimeout: 10000,
  commandTimeout: 5000,
});

// Redis event listeners
redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

redisClient.on('error', (error) => {
  logger.error('Redis client error:', error);
});

redisClient.on('close', () => {
  logger.warn('Redis client connection closed');
});

redisClient.on('reconnecting', () => {
  logger.info('Redis client reconnecting');
});

export class RedisService {
  private client: Redis;

  constructor() {
    this.client = redisClient;
  }

  // Basic operations
  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      throw error;
    }
  }

  async set(key: string, value: string, expirySeconds?: number): Promise<string> {
    try {
      if (expirySeconds) {
        return await this.client.setex(key, expirySeconds, value);
      }
      return await this.client.set(key, value);
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<number> {
    try {
      return await this.client.exists(key);
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error);
      throw error;
    }
  }

  // Hash operations
  async hget(key: string, field: string): Promise<string | null> {
    try {
      return await this.client.hget(key, field);
    } catch (error) {
      logger.error(`Redis HGET error for key ${key}, field ${field}:`, error);
      throw error;
    }
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    try {
      return await this.client.hset(key, field, value);
    } catch (error) {
      logger.error(`Redis HSET error for key ${key}, field ${field}:`, error);
      throw error;
    }
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    try {
      return await this.client.hgetall(key);
    } catch (error) {
      logger.error(`Redis HGETALL error for key ${key}:`, error);
      throw error;
    }
  }

  // List operations
  async lpush(key: string, ...values: string[]): Promise<number> {
    try {
      return await this.client.lpush(key, ...values);
    } catch (error) {
      logger.error(`Redis LPUSH error for key ${key}:`, error);
      throw error;
    }
  }

  async rpop(key: string): Promise<string | null> {
    try {
      return await this.client.rpop(key);
    } catch (error) {
      logger.error(`Redis RPOP error for key ${key}:`, error);
      throw error;
    }
  }

  // Set operations
  async sadd(key: string, ...members: string[]): Promise<number> {
    try {
      return await this.client.sadd(key, ...members);
    } catch (error) {
      logger.error(`Redis SADD error for key ${key}:`, error);
      throw error;
    }
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    try {
      return await this.client.srem(key, ...members);
    } catch (error) {
      logger.error(`Redis SREM error for key ${key}:`, error);
      throw error;
    }
  }

  async smembers(key: string): Promise<string[]> {
    try {
      return await this.client.smembers(key);
    } catch (error) {
      logger.error(`Redis SMEMBERS error for key ${key}:`, error);
      throw error;
    }
  }

  // Sorted set operations
  async zadd(key: string, score: number, member: string): Promise<number> {
    try {
      return await this.client.zadd(key, score, member);
    } catch (error) {
      logger.error(`Redis ZADD error for key ${key}:`, error);
      throw error;
    }
  }

  async zrange(key: string, start: number, stop: number, withscores?: 'WITHSCORES'): Promise<string[]> {
    try {
      return await this.client.zrange(key, start, stop, withscores);
    } catch (error) {
      logger.error(`Redis ZRANGE error for key ${key}:`, error);
      throw error;
    }
  }

  // Session management
  async createSession(sessionId: string, userId: string, expirySeconds: number = 3600): Promise<void> {
    const key = `session:${sessionId}`;
    await this.set(key, userId, expirySeconds);
  }

  async getSession(sessionId: string): Promise<string | null> {
    const key = `session:${sessionId}`;
    return await this.get(key);
  }

  async deleteSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await this.del(key);
  }

  // Rate limiting
  async checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
    try {
      const current = await this.client.get(key);
      if (current && parseInt(current) >= limit) {
        return false; // Rate limit exceeded
      }
      await this.client.incr(key);
      if (!current) {
        await this.client.expire(key, windowSeconds);
      }
      return true;
    } catch (error) {
      logger.error(`Rate limit check error for key ${key}:`, error);
      return true; // Allow on error
    }
  }

  // Cache management
  async cacheSet(key: string, data: any, expirySeconds: number = 3600): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      await this.set(key, serialized, expirySeconds);
    } catch (error) {
      logger.error(`Cache SET error for key ${key}:`, error);
    }
  }

  async cacheGet<T>(key: string): Promise<T | null> {
    try {
      const data = await this.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      logger.error(`Cache GET error for key ${key}:`, error);
      return null;
    }
  }

  // Utility methods
  async ping(): Promise<string> {
    return await this.client.ping();
  }

  async flushdb(): Promise<string> {
    return await this.client.flushdb();
  }

  async info(): Promise<string> {
    return await this.client.info();
  }
}

export const redisService = new RedisService();