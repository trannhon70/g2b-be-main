import { User } from 'src/module/user/entities/user.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Notification', schema: 'public' })
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    notificationType: string;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => User, (p) => p.id)
    user: User;

    @ManyToOne(() => User, (p) => p.id)
    from: User;

    @Column({ type: 'boolean', default: false })
    read: boolean;
}
