import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import RedisLib from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client!: Redis
    constructor() {
        // You can initialize any other properties or configurations here if needed
        this.onModuleInit()
    }

    async onModuleInit() {
        this.client = new RedisLib({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD, // Optional
        });

        this.client.on('connect', () => {
            console.log('Redis connected');
        });

        this.client.on('error', (err) => {
            console.error('Redis error:', err);
        });
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    getClient(): Redis {
        return this.client;
    }

    // Optional: some helper methods
    async set(key: string, value: string, ttlSeconds?: number) {
        if (ttlSeconds) {
            return this.client.set(key, value, 'EX', ttlSeconds);
        }
        return this.client.set(key, value);
    }

    async get(key: string) {
        return this.client.get(key);
    }

    async del(key: string) {
        return this.client.del(key);
    }
}
