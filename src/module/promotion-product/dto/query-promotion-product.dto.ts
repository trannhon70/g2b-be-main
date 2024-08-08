import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PagingDto } from 'src/shared/dto/base.dto';
import {
    AREA,
    PROMOTION_PRODUCT_TYPE,
} from 'src/shared/enum/promotion-product.enum';

export class QueryPromotionProduct extends PagingDto {
    @ApiProperty({ type: Boolean, default: false })
    @Transform(({ value }) => {
        return value === 'true';
    })
    populate: boolean;

    @ApiProperty({
        type: String,
        default: '370fe00e-65f0-4819-8950-5de20b5c16fc',
    })
    country: string;

    @ApiProperty({
        type: String,
        default: '5f0f40d1-956e-4ac9-9b15-d4d1c66a2f51',
    })
    city: string;

    @ApiProperty({
        type: String,
        default: '31fd7b71-f63d-4e2f-b8cf-5583fed24d1c',
    })
    district: string;

    @ApiProperty({
        type: String,
        enum: PROMOTION_PRODUCT_TYPE,
        default: PROMOTION_PRODUCT_TYPE.LED,
    })
    type: string;

    @ApiProperty({
        type: [String],
        enum: AREA,
        default: [AREA.ROUNDABOUT],
        isArray: true,
    })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return [value];
        }
        return value;
    })
    area: string[];
}
