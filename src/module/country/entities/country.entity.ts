import { PromotionProduct } from 'src/module/promotion-product/entities/promotion-product.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Country', schema: 'public' })
export class Country extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text', unique: true })
    code: string;

    @Column({ type: 'text' })
    postCode: string;

    @Column({ type: 'float' })
    centralLat: number;

    @Column({ type: 'float' })
    centralLong: number;

    @OneToMany(() => PromotionProduct, (p) => p.country)
    promotionProductions: PromotionProduct[];
}
