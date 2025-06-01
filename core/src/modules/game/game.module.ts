import { ApolloFederationDriverConfig, ApolloFederationDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { GameRepository } from './repositories/game.repository';
import { GameController } from './controllers/game.controller';
import { GamesService } from './services/game.service';
import { GameConsumer } from './queue/game.processor';
import { BullModule } from '@nestjs/bullmq';

@Module({
    imports: [
        TypeOrmModule.forFeature([ GameRepository ]),
        BullModule.registerQueue({
            name: 'game',
        }),
    ],
    controllers: [ GameController ],
    providers: [
        GameConsumer,
        GamesService,
        GameRepository,
        ...CommandHandlers,
        ...QueryHandlers,
    ],
})
export class GamesModule { }
