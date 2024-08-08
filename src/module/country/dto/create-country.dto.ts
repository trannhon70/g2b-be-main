import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
    @ApiProperty({ type: String, required: true })
    name: string;

    @ApiProperty({ type: String, required: true })
    code: string;

    @ApiProperty({ type: String, required: true })
    postCode: string;

    @ApiProperty({ type: Number, required: true })
    centralLat: number;

    @ApiProperty({ type: Number, required: true })
    centralLong: number;

    @ApiProperty({ type: String, required: false })
    description: string;
}
