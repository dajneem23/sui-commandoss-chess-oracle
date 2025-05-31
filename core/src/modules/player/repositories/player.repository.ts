import { NotFoundException } from '@nestjs/common';
import { Repository, Entity, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Player } from '../entities/player.entity';

@Entity()
export class PlayerRepository extends Repository<Player> {
    constructor(private dataSource: DataSource) {
        super(Player, dataSource.manager, dataSource.manager.queryRunner);
    }
    async createPlayer(playerRegisterDto: Player) {
        const id = uuidv4();
        const player = await this.save(super.create({ ...{ id }, ...playerRegisterDto }));
        return player;
    }

    async updatePlayer(playerDto) {
        const updatedPlayer = await super.findOne({ where: { id: playerDto.id } });
        await super.update({ id: playerDto.id }, playerDto);
        if (!updatedPlayer) {
            throw new NotFoundException();
        }
        return updatedPlayer;
    }

    async deletePlayer(playerDto) {
        // Todo
        const player = await super.findOne({ where: { id: playerDto.id } });
        if (!player) {
            throw new NotFoundException();
        }
        await super.delete({ id: playerDto.id });
        return player;
    }
}
