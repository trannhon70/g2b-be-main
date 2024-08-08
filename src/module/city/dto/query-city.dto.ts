import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/shared/dto/base.dto';

export class QueryCityDto extends PagingDto {
    @ApiProperty({ type: String, required: false })
    @Optional()
    country: string;
}
