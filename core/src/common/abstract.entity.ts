'use strict';
import { AggregateRoot } from '@nestjs/cqrs';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn ,BaseEntity, Index} from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    @Index()
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    @Index()
    updatedAt!: Date;

}
