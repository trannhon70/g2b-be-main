import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../user/entities/user.entity';
import { PromotionProduct } from '../promotion-product/entities/promotion-product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Wishlist, User, PromotionProduct])],
    controllers: [WishlistController],
    providers: [WishlistService],
})
export class WishlistModule {}
