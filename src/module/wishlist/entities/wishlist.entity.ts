import { PromotionProduct } from 'src/module/promotion-product/entities/promotion-product.entity';
import { User } from 'src/module/user/entities/user.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import {
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Wishlist', schema: 'Product' })
export class Wishlist extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.wishlist)
    @JoinColumn()
    user: User;

    @ManyToMany(() => PromotionProduct, (p) => p.wishlist)
    @JoinTable()
    promotionProducts: PromotionProduct[];
}
