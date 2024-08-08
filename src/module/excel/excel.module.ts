import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
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
    controllers: [ExcelController],
    providers: [ExcelService],
})
export class ExcelModule {}
