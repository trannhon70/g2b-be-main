import { BaseEntity } from 'src/shared/entity/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Role', schema: 'public' })
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    name: string;

    @Column({ type: 'text', array: true })
    permissions: string[];
}
