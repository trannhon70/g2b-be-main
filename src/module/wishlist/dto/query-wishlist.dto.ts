import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PagingDto } from 'src/shared/dto/base.dto';

export class QueryWishlist extends PagingDto {
    @ApiProperty({ type: Boolean, default: false })
    @Transform(({ value }) => {
        return value === 'true';
    })
    populate: boolean;
}

export class QueryMyWishlist extends PickType(QueryWishlist, ['populate']) {}
