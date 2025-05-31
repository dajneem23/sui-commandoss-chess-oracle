import { INestApplication } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
export async function setUpNats(app: INestApplication, port: number, host = '0.0.0.0') {
    app.connectMicroservice({
        transport: Transport.NATS,
        options: {
            url: `nats://${host}:${port}`,
        },
    });

    await app.startAllMicroservices();
}
