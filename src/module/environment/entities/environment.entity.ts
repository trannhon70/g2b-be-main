import { BaseEntity } from 'src/shared/entity/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Environment', schema: 'public' })
export class Environment extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    key: string;

    @Column({ type: 'text' })
    value: string;
}
