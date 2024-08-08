import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
    @ApiProperty({ type: 'String' })
    name: string;

    @ApiProperty({ type: 'String' })
    phone: string;

    @ApiProperty({ type: 'String' })
    email: string;

    @ApiProperty({ type: 'String' })
    content: string;
}
