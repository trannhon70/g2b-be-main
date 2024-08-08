import { BaseEntity } from 'src/shared/entity/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Contact', schema: 'public' })
export class Contact extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    phone: string;

    @Column({ type: 'text' })
    email: string;

    @Column({ type: 'text' })
    content: string;
}
