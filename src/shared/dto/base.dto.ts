import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class PagingDto {
    @Transform(({ value }) => {
        return value === 'true';
    })
    @ApiProperty({ type: Boolean, default: true })
    paging = true;

    @ApiProperty({ type: Number, default: 1 })
    page = 1;

    @Transform(({ value, obj }) => {
        return obj.paging === 'false' ? Number.MAX_SAFE_INTEGER : value;
    })
    @ApiProperty({ type: Number, default: 10 })
    limit: number;

    @ApiProperty({ type: String, default: 'id' })
    sort_column = 'id';

    @ApiProperty({ type: String, default: 'desc' })
    sort_direction = 'desc';
}
