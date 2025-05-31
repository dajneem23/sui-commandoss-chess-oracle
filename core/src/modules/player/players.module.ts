import { ApolloFederationDriverConfig, ApolloFederationDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { PlayerRepository } from './repositories/player.repository';
import { PlayerController } from './controllers/player.controller';
import { PlayersService } from './services/players.service';
import { PlayerConsumer } from './queue/player.processor';
import { BullModule } from '@nestjs/bullmq';

@Module({
    imports: [
        TypeOrmModule.forFeature([ PlayerRepository ]),
        BullModule.registerQueue({
            name: 'player',
        }),
    ],
    controllers: [ PlayerController ],
    providers: [
        PlayerConsumer,
        PlayersService,
        ...CommandHandlers,
        ...QueryHandlers,
    ],
})
export class PlayersModule { }
