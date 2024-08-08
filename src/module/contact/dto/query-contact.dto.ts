import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/shared/dto/base.dto';

export class QueryContactDto extends PagingDto {
    @ApiProperty({ type: String, required: false })
    keyword: string;
}
