import { Injectable } from '@nestjs/common';
import { CreateExcelDto } from './dto/excel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionProduct } from '../promotion-product/entities/promotion-product.entity';
import { Repository } from 'typeorm';
import { Workbook } from 'exceljs';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { format } from 'date-fns';
import path from 'path';

// const textColor = 'ff807f7d';
// const descriptionTextColor = 'ffabaaa7';
// const mainTextFontSize = 14;
// const descriptionFontSize = 12;

@Injectable()
export class ExcelService {
    constructor(
        @InjectRepository(PromotionProduct)
        private promotionProductRepository: Repository<PromotionProduct>,
        private http: HttpService,
    ) {}

    async create(createExcelDto: CreateExcelDto, res: Response) {
        const promotionProductions = await Promise.all(
            createExcelDto.promotionProducts.map((e) =>
                this.promotionProductRepository.findOne({
                    where: { id: e },
                    relations: {
                        city: true,
                        district: true,
                        ward: true,
                        country: true,
                    },
                }),
            ),
        );

        let workbook = new Workbook();
        workbook = await workbook.xlsx.readFile(
            path.join(
                __dirname,
                '..',
                '..',
                '..',
                'static_files',
                'G2B_file_mauBG-v01.xlsx',
            ),
        );
        workbook.creator = 'SSR Engineering';
        workbook.lastModifiedBy = 'SSR Engineering';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();

        workbook.views = [
            {
                x: 0,
                y: 0,
                width: 40000,
                height: 20000,
                firstSheet: 0,
                activeTab: 1,
                visibility: 'visible',
            },
        ];

        let currentRow = 11;
        for (const product of promotionProductions) {
            workbook = await this.fillProduct(
                workbook,
                product,
                currentRow,
                createExcelDto.withLogo,
            );
            currentRow++;
        }

        const fileName = 'g2b.xlsx';
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + fileName,
        );
        return workbook.xlsx.write(res);
    }

    async fillProduct(
        workbook: Workbook,
        p: PromotionProduct,
        currentRow: number,
        withLogo = false,
    ) {
        const worksheet = workbook.getWorksheet(1);

        worksheet.getCell(`C${currentRow}`).value = p.type;
        worksheet.getCell(`D${currentRow}`).value = p.sku;
        worksheet.getCell(`E${currentRow}`).value = p.title;
        worksheet.getCell(`F${currentRow}`).value = p.city.name;
        worksheet.getCell(`G${currentRow}`).value =
            `${p?.address_detail} ${p?.street}, ${p?.ward.name}, ${p?.district.name}, ${p?.city.name}, ${p?.country.name}`;
        worksheet.getCell(`I${currentRow}`).value =
            `${p.width}m x ${p.height}m`;
        worksheet.getCell(`J${currentRow}`).value =
            `${p.frequency} / ${format(p.operationTimeFrom, 'HH:mm')} - ${format(p.operationTimeTo, 'HH:mm z')}`;
        worksheet.getCell(`K${currentRow}`).value = p.adSide;
        worksheet.getCell(`N${currentRow}`).value = p.cost_in_text;

        worksheet.views = [{ showGridLines: false }];

        return workbook;
    }

    async fetchImage(src: string) {
        const image = await firstValueFrom(
            this.http.get(src, {
                responseType: 'arraybuffer',
            }),
        );
        return image.data;
    }
}
