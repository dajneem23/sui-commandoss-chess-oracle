import { NotFoundException , Injectable} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Player } from '../entities/player.entity';

@Injectable()
export class PlayerRepository extends Repository<Player> {
    constructor(private dataSource: DataSource) {
        super(Player, dataSource.createEntityManager());
    }
    async createPlayer(playerRegisterDto: Player) {
        console.log('Creating player with DTO:', playerRegisterDto);
        const id = uuidv4();
        const player =  this.create({ ...{ id }, ...playerRegisterDto });
        await super.save(player);
        console.log('Player created:', player.id);
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
