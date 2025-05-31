import { ICommand } from '@nestjs/cqrs';
import { Player } from '../entities/player.entity';


export class CreatePlayerCommand implements ICommand {
    constructor(public readonly player: Player) {}
}
