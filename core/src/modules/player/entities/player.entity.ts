import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';

@Entity()
export class Player extends AbstractEntity {

  @Column()
  name!: string;

  @Column()
  federation!: string;

  @Column()
  year!: number;

  @Column({ nullable: true })
  title?: string;

  @Column()
  standard!: number;

  @Column({ nullable: true })
  rapid?: number;

  @Column({ nullable: true })
  blitz?: number;

  @Column({ default: false })
  inactive!: boolean;

  @Column({ nullable: true })
  suiObjectid?: string;
}
