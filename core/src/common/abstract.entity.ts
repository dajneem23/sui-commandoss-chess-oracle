'use strict';
import { AggregateRoot } from '@nestjs/cqrs';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn ,BaseEntity} from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt!: Date;

}
