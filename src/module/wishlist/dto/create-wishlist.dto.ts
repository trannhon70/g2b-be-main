import { ApiProperty } from '@nestjs/swagger';

export class CreateWishlistDto {
    @ApiProperty({ type: [String], isArray: true, default: [] })
    promotionProducts: string[];
}
