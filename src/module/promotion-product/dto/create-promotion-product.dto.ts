import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';
import {
    AREA,
    PROMOTION_PRODUCT_TYPE,
} from 'src/shared/enum/promotion-product.enum';

export class CreatePromotionProductDto {
    @ApiProperty({
        type: PROMOTION_PRODUCT_TYPE,
        enum: PROMOTION_PRODUCT_TYPE,
        default: PROMOTION_PRODUCT_TYPE.LED,
    })
    type: PROMOTION_PRODUCT_TYPE;

    @ApiProperty({
        type: String,
        required: true,
        default: faker.string.sample(10),
    })
    slug: string;

    @ApiProperty({
        type: [String],
        required: true,
        isArray: true,
        default: [faker.image.url(), faker.image.url(), faker.image.url()],
    })
    images: string[];

    @ApiProperty({
        type: String,
        required: true,
        default: faker.string.sample(20),
    })
    title: string;

    @ApiProperty({
        type: String,
        required: true,
        default: faker.string.sample(100),
    })
    address_summary: string;

    @ApiProperty({
        type: String,
        required: true,
        default: '69b2a766-f068-46cb-ac65-7ea95470f0b1',
    })
    country: string;

    @ApiProperty({ type: String, required: true })
    state_province: string;

    @ApiProperty({
        type: String,
        required: true,
        default: '5f0f40d1-956e-4ac9-9b15-d4d1c66a2f51',
    })
    city: string;

    @ApiProperty({
        type: String,
        required: true,
        default: '31fd7b71-f63d-4e2f-b8cf-5583fed24d1c',
    })
    district: string;

    @ApiProperty({ type: String, required: true })
    ward: string;

    @ApiProperty({ type: String, required: true })
    street: string;

    @ApiProperty({
        type: String,
        required: true,
        default: faker.string.sample(100),
    })
    address_detail: string;

    @ApiProperty({
        type: String,
        required: true,
        default: faker.string.sample(100),
    })
    location_description: string;

    @ApiProperty({ type: String, required: true })
    information: string;

    @ApiProperty({
        type: String,
        required: true,
        default: faker.string.sample(40),
    })
    frequency: string;

    @ApiProperty({ type: String, required: true })
    videoDuration: string;

    @ApiProperty({
        type: String,
        required: true,
        default: faker.string.sample(40),
    })
    traffic: string;

    @ApiProperty({
        type: String,
        required: true,
        default: faker.string.sample(40),
    })
    gps: string;

    @ApiProperty({
        type: Number,
        required: true,
        default: faker.location.latitude(),
    })
    lat: number;

    @ApiProperty({
        type: Number,
        required: true,
        default: faker.location.longitude(),
    })
    long: number;

    @ApiProperty({
        type: String,
        required: true,
        default: faker.string.sample(40),
    })
    cost_in_text: string;

    @ApiProperty({
        type: Number,
        required: true,
        default: faker.number.int({ min: 1 }),
    })
    @Min(1)
    cost: number;

    @ApiProperty({
        type: Number,
        required: true,
        default: faker.number.int({ min: 1, max: 4 }),
    })
    @Min(1)
    adSide: number;

    @ApiProperty({
        type: String,
        required: true,
        default: faker.string.sample(6),
    })
    sku: string;

    // in meter
    @ApiProperty({ type: Number, default: faker.number.int() })
    width: number;

    // in meter
    @ApiProperty({ type: Number, default: faker.number.int() })
    height: number;

    @ApiProperty({ type: Number, default: faker.number.int() })
    pixelWidth: number;

    @ApiProperty({ type: Number, default: faker.number.int() })
    pixelHeight: number;

    // In second
    @ApiProperty({ type: Number, default: faker.number.int() })
    videoDurationFrom: number;

    // In second
    @ApiProperty({ type: Number, default: faker.number.int() })
    videoDurationTo: number;

    // vehicles / day
    @ApiProperty({ type: Number, default: faker.number.int() })
    trafficQuantity: number;

    @ApiProperty({ type: Number, default: faker.date.anytime() })
    operationTimeFrom: Date;

    @ApiProperty({ type: Number, default: faker.date.anytime() })
    operationTimeTo: Date;

    @ApiProperty({
        type: [String],
        default: [AREA.ROUNDABOUT, AREA.AIRPORT, AREA.INTERSECTION],
    })
    area: string[];
}
