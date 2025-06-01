import { Entity, Column, Index } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';

@Entity()
export class Game extends AbstractEntity {
    @Column({ unique: true })
    @Index('idx_game_lichess_id')
    liChessId!: string;
    @Column({ nullable: true }) suiObjectId!: string;
    @Column({ nullable: true }) event!: string;
    @Column({ nullable: true }) site!: string;
    @Column({ nullable: true }) white!: string;
    @Column({ nullable: true }) black!: string;
    @Column({ nullable: true }) result!: string;
    @Column({ nullable: true }) utcDate!: string;
    @Column({ nullable: true }) utcTime!: string;
    @Column({ nullable: true }) whiteElo!: number;
    @Column({ nullable: true }) blackElo!: number;
    @Column({ nullable: true }) whiteRatingDiff!: string;
    @Column({ nullable: true }) blackRatingDiff!: string;
    @Column({ nullable: true }) eco!: string;
    @Column({ nullable: true }) opening!: string;
    @Column({ nullable: true }) timeControl!: string;
    @Column({ nullable: true }) termination!: string;

    @Column('text', { nullable: true }) moves!: string;
}
