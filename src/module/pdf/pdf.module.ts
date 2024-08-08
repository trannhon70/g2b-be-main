import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
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
    controllers: [PdfController],
    providers: [PdfService],
})
export class PdfModule {}
