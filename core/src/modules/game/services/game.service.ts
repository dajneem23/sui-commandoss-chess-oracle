import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Game } from '../entities/game.entity';
import { CreateGameCommand } from '../commands/create-game.command';


@Injectable()
export class GamesService {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus,
    ) {}

     createGame(game) {
        return this._commandBus.execute(new CreateGameCommand(game));
    }

}
