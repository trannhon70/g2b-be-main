import { User } from 'src/module/user/entities/user.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Token', schema: 'public' })
export class Token extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    token: string;

    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @Column({ type: 'boolean' })
    expired: boolean;

    @Column({ type: 'timestamp with time zone' })
    expiredAt: string;

    @Column({ type: 'text' })
    type: string;

    @Column({ type: 'text' })
    email: string;
}
