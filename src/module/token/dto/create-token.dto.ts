import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
    @ApiProperty({ type: String, required: true })
    email: string;

    @ApiProperty({ type: String, required: true })
    type: string;
}
