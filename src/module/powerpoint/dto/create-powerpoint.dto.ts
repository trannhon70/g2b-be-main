import { ApiProperty } from '@nestjs/swagger';

export class CreatePowerpointDto {
    @ApiProperty({ type: [String], default: [] })
    promotionProducts: string[];

    @ApiProperty({ type: Boolean, default: false })
    withLogo: boolean;
}
