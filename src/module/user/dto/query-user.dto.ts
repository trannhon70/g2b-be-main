import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { PagingDto } from 'src/shared/dto/base.dto';

export class QueryUserDto extends PagingDto {
    @ApiProperty({ type: String, required: false })
    keyword?: string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ type: String, required: false })
    role: string;
}
