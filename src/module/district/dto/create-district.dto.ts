import { ApiProperty } from '@nestjs/swagger';

export class CreateDistrictDto {
    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String })
    code: string;

    @ApiProperty({ type: String })
    postCode: string;

    @ApiProperty({ type: Number })
    centralLat: number;

    @ApiProperty({ type: Number })
    centralLong: number;

    @ApiProperty({ type: String })
    city: string;
}
