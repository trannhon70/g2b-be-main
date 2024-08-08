import { City } from 'src/module/city/entities/city.entity';
import { Country } from 'src/module/country/entities/country.entity';
import { District } from 'src/module/district/entities/district.entity';
import { Ward } from 'src/module/ward/entities/ward.entity';
import { Wishlist } from 'src/module/wishlist/entities/wishlist.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import {
    AREA,
    PROMOTION_PRODUCT_TYPE,
} from 'src/shared/enum/promotion-product.enum';
import {
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'PromotionProduct', schema: 'Product' })
export class PromotionProduct extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true,
        nullable: true,
    })
    sku: string;

    @Column('text')
    type: PROMOTION_PRODUCT_TYPE;

    @Column({ unique: true })
    slug: string;

    @Column('text', { array: true })
    images: string[];

    @Column('text')
    title: string;

    @Column('text')
    address_summary: string;

    @ManyToOne(() => Country, (c) => c.id)
    country: Country;

    @ManyToOne(() => City, (c) => c.id)
    city: City;

    @Column('text')
    state_province: string;

    @ManyToOne(() => District, (c) => c.id)
    district: District;

    @ManyToOne(() => Ward, (c) => c.id)
    ward: Ward;

    @Column('text')
    street: string;

    @Column('text')
    address_detail: string;

    @Column('text')
    location_description: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    // in meter
    @Column({ type: 'float', default: 0 })
    width: number;

    // in meter
    @Column({ type: 'float', default: 0 })
    height: number;

    @Column({ type: 'float', default: 0 })
    pixelWidth: number;

    @Column({ type: 'float', default: 0 })
    pixelHeight: number;

    @Column('text')
    information: string;

    @Column('text')
    frequency: string;

    @Column('text')
    videoDuration: string;

    // In second
    @Column({ type: 'float', default: 0 })
    videoDurationFrom: number;

    // In second
    @Column({ type: 'float', default: 0 })
    videoDurationTo: number;

    @Column('text')
    traffic: string;

    // vehicles / day
    @Column({ type: 'float', default: 0 })
    trafficQuantity: number;

    @Column('text')
    gps: string;

    @Column('float')
    lat: number;

    @Column('float')
    long: number;

    @Column('text')
    cost_in_text: string;

    @Column('float')
    cost: number;

    @Column({ type: 'timestamp with time zone', default: new Date() })
    operationTimeFrom: Date;

    @Column({ type: 'timestamp with time zone', default: new Date() })
    operationTimeTo: Date;

    @Column({ type: 'integer', default: 1 })
    adSide: number;

    @Column({ type: 'jsonb', default: [AREA.ROUNDABOUT] })
    area: string[];

    @ManyToMany(() => Wishlist, (w) => w.promotionProducts)
    wishlist: Wishlist[];
}
