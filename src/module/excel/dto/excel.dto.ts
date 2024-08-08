import { ApiProperty } from '@nestjs/swagger';

export class CreateExcelDto {
    @ApiProperty({ type: [String], default: [] })
    promotionProducts: string[];

    @ApiProperty({ type: Boolean, default: false })
    withLogo?: boolean;
}
