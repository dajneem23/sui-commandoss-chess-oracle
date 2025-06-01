import { Logger } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreatePlayerCommand } from '../create-player.command';
import { PlayerRepository } from '../../repositories/player.repository';
import { InjectRepository } from '@nestjs/typeorm';

@CommandHandler(CreatePlayerCommand)
export class CreateUserHandler implements ICommandHandler<CreatePlayerCommand> {
    constructor(
        private readonly _repository: PlayerRepository,
    ) {}

    async execute(command: CreatePlayerCommand) {
        Logger.log('Async CreateUserHandler...', command);

        return this._repository.createPlayer(command.player)
    }
}
