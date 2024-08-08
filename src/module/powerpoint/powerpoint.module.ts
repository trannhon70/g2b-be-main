import { Module } from '@nestjs/common';
import { PowerpointService } from './powerpoint.service';
import { PowerpointController } from './powerpoint.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionProduct } from '../promotion-product/entities/promotion-product.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        TypeOrmModule.forFeature([PromotionProduct]),
        HttpModule.register({
            timeout: 999999,
            maxRedirects: 99,
        }),
    ],
    controllers: [PowerpointController],
    providers: [PowerpointService],
})
export class PowerpointModule {}
