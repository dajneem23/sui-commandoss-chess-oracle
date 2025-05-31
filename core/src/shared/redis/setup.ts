import { INestApplication } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

export const setUpRedis = async (app: INestApplication, url: string) => {
    app.connectMicroservice({
        transport: Transport.REDIS,
        options: {
            url,
        },
    });
    return app;
};
