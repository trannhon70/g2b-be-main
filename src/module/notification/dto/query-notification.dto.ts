import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PagingDto } from 'src/shared/dto/base.dto';

export class QueryNotificationDto extends PagingDto {
    @ApiProperty({ type: Boolean, default: false })
    @Transform(({ value }) => {
        return value === 'true';
    })
    populate: boolean;
}
