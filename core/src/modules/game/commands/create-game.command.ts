import { ICommand } from '@nestjs/cqrs';
import { Game } from '../entities/game.entity';


export class CreateGameCommand implements ICommand {
    constructor(public readonly game: Game) {}
}
