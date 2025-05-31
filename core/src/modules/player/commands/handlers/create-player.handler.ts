import { Logger } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreatePlayerCommand } from '../create-player.command';
import { PlayerRepository } from '../../repositories/player.repository';


@CommandHandler(CreatePlayerCommand)
export class CreateUserHandler implements ICommandHandler<CreatePlayerCommand> {
    constructor(
        private readonly _repository: PlayerRepository,
    ) {}

    async execute(command: CreatePlayerCommand) {
        Logger.log('Async CreateUserHandler...', 'CreatePlayerCommand');

        const { player } = command;
        await this._repository.createPlayer(player)
    }
}
