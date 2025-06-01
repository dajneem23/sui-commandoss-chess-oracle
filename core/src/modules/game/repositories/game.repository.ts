import { NotFoundException, Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Game } from '../entities/game.entity';

@Injectable()
export class GameRepository extends Repository<Game> {
    constructor(private dataSource: DataSource) {
        super(Game, dataSource.createEntityManager());
    }
    async createGame(gameRegisterDto: Game) {
        console.log('Creating game with DTO:', gameRegisterDto);
        const id = uuidv4();
        // const game =  this.create({ ...{ id }, ...gameRegisterDto });
        const game = await this.upsert({ ...{ id }, ...gameRegisterDto },
            {
                conflictPaths: [ 'liChessId' ],
                skipUpdateIfNoValuesChanged: true,
                upsertType: "on-duplicate-key-update"
            }
        );
        // await super.save(game);
        console.log('Game created:', game.raw);
        return game;
    }

    async updateGame(gameDto) {
        const updatedGame = await super.findOne({ where: { id: gameDto.id } });
        await super.update({ id: gameDto.id }, gameDto);
        if (!updatedGame) {
            throw new NotFoundException();
        }
        return updatedGame;
    }

    async deleteGame(gameDto) {
        // Todo
        const game = await super.findOne({ where: { id: gameDto.id } });
        if (!game) {
            throw new NotFoundException();
        }
        await super.delete({ id: gameDto.id });
        return game;
    }
}
