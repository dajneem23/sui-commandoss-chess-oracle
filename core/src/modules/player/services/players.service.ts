import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Player } from '../entities/player.entity';
import { CreatePlayerCommand } from '../commands/create-player.command';


@Injectable()
export class PlayersService {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus,
    ) {}

    async createPlayer(player:Player) {
        return this._commandBus.execute(new CreatePlayerCommand(player));
    }

}
