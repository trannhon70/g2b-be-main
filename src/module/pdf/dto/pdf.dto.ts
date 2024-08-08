import { ApiProperty } from '@nestjs/swagger';

export class CreatePdfDto {
    @ApiProperty({ type: [String], default: [] })
    promotionProducts: string[];

    @ApiProperty({ type: Boolean, default: false })
    withLogo: boolean;
}
