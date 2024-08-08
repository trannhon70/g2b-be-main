import { Module } from '@nestjs/common';
import { PromotionProductService } from './promotion-product.service';
import { PromotionProductController } from './promotion-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionProduct } from './entities/promotion-product.entity';
import { NotificationModule } from '../notification/notification.module';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([PromotionProduct, User]),
        NotificationModule,
    ],
    controllers: [PromotionProductController],
    providers: [PromotionProductService],
})
export class PromotionProductModule {}
