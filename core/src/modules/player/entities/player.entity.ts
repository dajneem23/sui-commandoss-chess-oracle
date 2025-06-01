import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';

@Entity()
export class Player extends AbstractEntity {

    @Column()
    liChessId!: string;

    @Column()
    name!: string;

    @Column()
    federation!: string;

    @Column({ nullable: true })
    year!: number;

    @Column({ nullable: true })
    title?: string;

    @Column({ nullable: true,default: 0 })
    standard!: number;

    @Column({ nullable: true,default: 0 })
    rapid?: number;

    @Column({ nullable: true,default: 0 })
    blitz?: number;

    @Column({ default: false })
    inactive!: boolean;

    @Column({ nullable: true })
    suiObjectid?: string;
}
