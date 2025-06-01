import { Logger } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreateGameCommand } from '../create-game.command';
import { GameRepository } from '../../repositories/game.repository';
import { InjectRepository } from '@nestjs/typeorm';

@CommandHandler(CreateGameCommand)
export class CreateUserHandler implements ICommandHandler<CreateGameCommand> {
    constructor(
        private readonly _repository: GameRepository,
    ) {}

    async execute(command: CreateGameCommand) {
        Logger.log('Async CreateGameHandler...', command);

        return this._repository.createGame(command.game)
    }
}
