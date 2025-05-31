import { Injectable } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';


@Injectable()
export class RedisIoAdapter extends IoAdapter {

    contu
    private adapterConstructor: ReturnType<typeof createAdapter> | undefined;

    async connectToRedis(): Promise<void> {
        const pubClient = createClient({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
            password: process.env.REDIS_PASSWORD, // Optional
        });
        const subClient = pubClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()]);

        this.adapterConstructor = createAdapter(pubClient, subClient);
    }

    createIOServer(port: number, options?: ServerOptions): any {
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}
