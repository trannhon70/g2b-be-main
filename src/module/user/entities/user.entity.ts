import { Wishlist } from 'src/module/wishlist/entities/wishlist.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'User', schema: 'public' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    email: string;

    @Column({ unique: true, nullable: true })
    googleID: string;

    @Column({ type: 'text', nullable: true })
    avatar: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text', nullable: true })
    firstname: string;

    @Column({ type: 'text', nullable: true })
    lastname: string;

    @Column({ type: 'text' })
    role: string;

    @OneToOne(() => Wishlist, (wishlist) => wishlist.user)
    wishlist: Wishlist;
}
