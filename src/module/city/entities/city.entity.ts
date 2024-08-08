import { Country } from 'src/module/country/entities/country.entity';
import { PromotionProduct } from 'src/module/promotion-product/entities/promotion-product.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'City', schema: 'public' })
export class City extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    name: string;

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

    @ManyToOne(() => Country, (country) => country.id)
    country: Country;
}
