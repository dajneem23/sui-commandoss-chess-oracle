import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CqrsModule } from '@nestjs/cqrs';
import { HealthController } from './modules/health/health.controller';
import { PlayerController } from './modules/player/controllers/player.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoiPipeModule } from 'nestjs-joi';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { SharedModule } from './shared.module';
import { ConfigService } from './shared/services/config.service';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { TerminusModule } from '@nestjs/terminus';
import { BullModule } from '@nestjs/bullmq';
import { PlayersModule } from './modules/player/players.module';

@Module({
    imports: [
        ConfigModule.forRoot(), // ensure you have a configuration module
        CqrsModule.forRoot(),
        BullModule.forRootAsync({

            imports: [ SharedModule ],
            useFactory: (configService: ConfigService) => (configService.bullMqConfig),
            inject: [ ConfigService ],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ SharedModule ],
            useFactory: (configService: ConfigService) => configService.typeOrmConfig,
            inject: [ ConfigService ],
        }),
        WinstonModule.forRootAsync({
            imports: [ SharedModule ],
            useFactory: (configService: ConfigService) => configService.winstonConfig,
            inject: [ ConfigService ],
        }),
        JoiPipeModule.forRoot({
            pipeOpts: {
                usePipeValidationException: true,
                defaultValidationOptions: {
                    abortEarly: false,
                    allowUnknown: true,
                    stripUnknown: true,
                    debug: true,
                },
            },
        }),
        HealthModule,
        TerminusModule,
        PlayersModule
    ],
    controllers: [ AppController, HealthController, PlayerController ],
    providers: [
        AppService
    ],
})
export class AppModule { }
