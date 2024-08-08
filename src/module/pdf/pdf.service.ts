import { Injectable } from '@nestjs/common';
import { CreatePdfDto } from './dto/pdf.dto';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionProduct } from '../promotion-product/entities/promotion-product.entity';
import { Repository } from 'typeorm';
import PDFDocument from 'pdfkit';
import path from 'path';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { format } from 'date-fns';
import { Font } from 'src/shared/utils/font';

// A4 (595.28 x 841.89) portrait
// A4 (841.89 x 595.28) landscape
// const lineColor = '#E0DFDB';
const textColor = '#FDCD27';
const descriptionColor = '#FFFFFF';
const titleFontSize = 17;
const mainTextFontSize = 10;
const descriptionFontSize = 7;

@Injectable()
export class PdfService {
    constructor(
        @InjectRepository(PromotionProduct)
        private promotionProductRepository: Repository<PromotionProduct>,
        private http: HttpService,
    ) {}

    async create(createPdfDto: CreatePdfDto, res: Response) {
        let doc = new PDFDocument({
            margins: {
                top: 50,
                bottom: 50,
                left: 72,
                right: 72,
            },
            font: Font.getFont('Inter-Regular.ttf'),
            lang: 'vi-VN',
            size: 'A4',
            layout: 'landscape',
        });

        // doc = await this.addCoverPage(doc);
        // doc.addPage({
        //     margins: {
        //         top: 0,
        //         bottom: 0,
        //         left: 0,
        //         right: 0,
        //     },
        //     font: Font.getFont('Inter-Regular.ttf'),
        //     lang: 'vi-VN',
        //     size: 'A4',
        // });
        // doc.switchToPage(1);

        const promotionProductions = await Promise.all(
            createPdfDto.promotionProducts.map((e) =>
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
        if (promotionProductions.length > 0) {
            doc = await this.fillPage(
                doc,
                promotionProductions[0],
                createPdfDto.withLogo,
            );
            // doc.addPage({
            //     margins: {
            //         top: 0,
            //         bottom: 0,
            //         left: 0,
            //         right: 0,
            //     },
            //     font: Font.getFont('Inter-Regular.ttf'),
            //     lang: 'vi-VN',
            //     size: 'A4',
            // });
            // doc.switchToPage(2);
            doc = await this.fillImages(
                doc,
                promotionProductions[0],
                createPdfDto.withLogo,
            );
        }

        promotionProductions.shift();
        let index = 1;

        for (const p of promotionProductions) {
            doc.addPage({
                margins: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
                font: Font.getFont('Inter-Regular.ttf'),
                lang: 'vi-VN',
                size: 'A4',
                layout: 'landscape',
            });
            doc.switchToPage(index);
            doc = await this.fillPage(doc, p, createPdfDto.withLogo);
            // doc.switchToPage(index + 1);
            doc = await this.fillImages(doc, p, createPdfDto.withLogo);
            index++;
        }

        const fileName = 'g2b.pdf';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + fileName,
        );

        doc.pipe(res);
        doc.end();
        return;
    }

    async addCoverPage(doc: PDFKit.PDFDocument) {
        doc.image(
            path.join(
                __dirname,
                '..',
                '..',
                '..',
                'static_files',
                'images',
                'A4-COVER.png',
            ),
            0,
            0,
            {
                width: 595,
            },
        );

        return doc;
    }

    async fillPage(
        doc: PDFKit.PDFDocument,
        p: PromotionProduct,
        withLogo = false,
    ) {
        // Big image
        // if (p.images.length >= 1) {
        //     const img = await this.fetchImage(p.images[0]);
        //     doc.image(img, 0, 150, {
        //         width: 306,
        //     });
        // }

        // Fill background
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#000000');

        // Title
        doc.fontSize(titleFontSize)
            .font(Font.getFont('Inter-ExtraBold.ttf'))
            .fillColor('#FFFFFF')
            .opacity(1)
            .text(p.title.toUpperCase(), 10, 10, {
                width: 400,
                lineBreak: true,
                characterSpacing: 5,
                align: 'center',
                lineGap: 1,
                paragraphGap: -3,
            });

        doc.rect(0, 60, 420, 2).fill('#FDCD27');

        let currentY = 70;
        const step = 16.5;

        // ADDRESS
        // Icon
        //     const img = await this.fetchImage(p.images[0]);
        //     doc.image(img, 20, currentY, {
        //         width: 306,
        //     });
        doc.image(this.getIconImage('address.png'), 20, currentY, {
            width: 15,
            height: 15,
        });
        doc.fontSize(mainTextFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(textColor)
            .text('ADDRESS', 50, currentY);

        doc.fontSize(descriptionFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(descriptionColor)
            .opacity(1)
            .text(
                `${p?.address_detail} ${p?.street}, ${p?.ward.name}, ${p?.district.name}, ${p?.city.name}, ${p?.country.name}`,
                50,
                currentY + step,
                { width: 380 },
            );

        currentY += 2 * step;
        // City
        doc.image(this.getIconImage('city.png'), 20, currentY, {
            width: 15,
            height: 15,
        });
        doc.fontSize(mainTextFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(textColor)
            .opacity(1)
            .text('CITY', 50, currentY);

        doc.fontSize(descriptionFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(descriptionColor)
            .opacity(1)
            .text(`${p.city.name}`, 50, currentY + step);

        currentY += 2 * step;
        //DESCRIPTION
        doc.image(this.getIconImage('description.png'), 20, currentY, {
            width: 15,
            height: 15,
        });
        doc.fontSize(mainTextFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(textColor)
            .opacity(1)
            .text('DESCRIPTION', 50, currentY);

        doc.fontSize(descriptionFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(descriptionColor)
            .opacity(1)
            .text(`${p.location_description}`, 50, currentY + step, {
                width: 350,
            });

        currentY += 3 * step;
        // DIMENSION
        doc.image(this.getIconImage('dimension.png'), 20, currentY, {
            width: 15,
            height: 15,
        });
        doc.fontSize(mainTextFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(textColor)
            .opacity(1)
            .text('DIMENSION', 50, currentY);

        doc.fontSize(descriptionFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(descriptionColor)
            .opacity(1)
            .text(
                `${p.width}m (horizontal) x ${p.height}m (height)`,
                50,
                currentY + step,
            );

        currentY += 2 * step;
        // PIXEL
        doc.image(this.getIconImage('pixel.png'), 20, currentY, {
            width: 15,
            height: 15,
        });
        doc.fontSize(mainTextFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(textColor)
            .opacity(1)
            .text('PIXEL', 50, currentY);

        doc.fontSize(descriptionFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(descriptionColor)
            .opacity(1)
            .text(`${p.pixelWidth} x ${p.pixelHeight}`, 50, currentY + step);

        currentY += 2 * step;
        // OPERATION TIME
        doc.image(this.getIconImage('operation-time.png'), 20, currentY, {
            width: 15,
            height: 15,
        });
        doc.fontSize(mainTextFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(textColor)
            .opacity(1)
            .text('OPERATION TIME', 50, currentY);

        doc.fontSize(descriptionFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(descriptionColor)
            .opacity(1)
            .text(
                `${format(p.operationTimeFrom, 'HH:mm')} - ${format(p.operationTimeTo, 'HH:mm z')}`,
                50,
                currentY + step,
            );

        currentY += 2 * step;
        // FREQUENCY
        doc.image(this.getIconImage('frequency.png'), 20, currentY, {
            width: 15,
            height: 15,
        });
        doc.fontSize(mainTextFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(textColor)
            .opacity(1)
            .text('FREQUENCY', 50, currentY);

        doc.fontSize(descriptionFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(descriptionColor)
            .opacity(1)
            .text(`${p.frequency} spots`, 50, currentY + step);

        currentY += 2 * step;
        // VIDEO DURATION
        doc.image(this.getIconImage('video_duration.png'), 20, currentY, {
            width: 15,
            height: 15,
        });
        doc.fontSize(mainTextFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(textColor)
            .opacity(1)
            .text('VIDEO DURATION', 50, currentY);

        doc.fontSize(descriptionFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(descriptionColor)
            .opacity(1)
            .text(`${p.videoDuration}`, 50, currentY + step);

        currentY += 2 * step;
        // TRAFFIC
        doc.image(this.getIconImage('traffic.png'), 20, currentY, {
            width: 15,
            height: 15,
        });
        doc.fontSize(mainTextFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(textColor)
            .opacity(1)
            .text('TRAFFIC', 50, currentY);

        doc.fontSize(descriptionFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(descriptionColor)
            .opacity(1)
            .text(`${p.traffic} vehicles/day`, 50, currentY + step);

        // doc.moveTo(335, 620).lineTo(567, 620).fillOpacity(0.5).fill('#000000');

        // COST
        currentY += 2 * step;
        doc.image(this.getIconImage('cost.png'), 20, currentY, {
            width: 15,
            height: 15,
        });
        doc.fontSize(mainTextFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(textColor)
            .opacity(1)
            .text('COST', 50, currentY);

        doc.fontSize(descriptionFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(descriptionColor)
            .opacity(1)
            .text(`${p.cost_in_text}`, 50, currentY + step);

        // CODE
        currentY += 2 * step;
        doc.image(this.getIconImage('code.png'), 20, currentY, {
            width: 15,
            height: 15,
        });
        doc.fontSize(mainTextFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(textColor)
            .opacity(1)
            .text('CODE', 50, currentY);

        doc.fontSize(descriptionFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(descriptionColor)
            .opacity(1)
            .text(`${p.sku}`, 50, currentY + step);

        // doc.moveTo(335, 692).lineTo(567, 692).fillOpacity(0.5).fill('#000000');
        currentY += 2 * step;
        // FILE FORMAT
        doc.image(this.getIconImage('TYPE.png'), 20, currentY, {
            width: 15,
            height: 15,
        });
        doc.fontSize(mainTextFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(textColor)
            .opacity(1)
            .text('TYPE', 50, currentY);

        doc.fontSize(descriptionFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(descriptionColor)
            .opacity(1)
            .text(`${p.type.replace('_', ' ')}`, 50, currentY + step);

        currentY += 2 * step;
        // AD SIDE
        doc.image(this.getIconImage('Adside.png'), 20, currentY, {
            width: 15,
            height: 15,
        });
        doc.fontSize(mainTextFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(textColor)
            .opacity(1)
            .text('AD SIDE', 50, currentY);

        doc.fontSize(descriptionFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(descriptionColor)
            .opacity(1)
            .text(`${p.adSide}`, 50, currentY + step);

        currentY += 2 * step;
        // AREAS
        doc.image(this.getIconImage('Areas.png'), 20, currentY, {
            width: 15,
            height: 15,
        });
        doc.fontSize(mainTextFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(textColor)
            .opacity(1)
            .text('AREAS', 50, currentY);

        doc.fontSize(descriptionFontSize)
            .font(Font.getFont('Inter-Regular.ttf'))
            .fillColor(descriptionColor)
            .opacity(1)
            .text(`${p.area.join(', ')}`, 50, currentY + step);

        doc.rect(415, 0, 20, 595.28).fill('#FDCD27');
        doc = await this.addFooterAndWatermark(doc, withLogo);

        return doc;
    }

    async fillImages(
        doc: PDFKit.PDFDocument,
        p: PromotionProduct,
        withLogo = false,
    ) {
        // doc.image(
        //     path.join(
        //         __dirname,
        //         '..',
        //         '..',
        //         '..',
        //         'static_files',
        //         'images',
        //         'OTHERSIDE.png',
        //     ),
        //     559,
        //     122,
        //     {
        //         width: 14,
        //         height: 246,
        //     },
        // );

        // // Title
        // doc.fontSize(titleFontSize)
        //     .font(Font.getFont('Inter-ExtraBold.ttf'))
        //     .fillColor('#000000')
        //     .opacity(0.7)
        //     .text(p.title.toUpperCase(), 10, 43, {
        //         width: 550,
        //         lineBreak: true,
        //         characterSpacing: 5,
        //         align: 'center',
        //         lineGap: 1,
        //         paragraphGap: -3,
        //     });

        if (p.images.length >= 1) {
            const img = await this.fetchImage(p.images[0]);
            doc.image(img, 435, 0, { width: 406, height: 197 });
        }
        if (p.images.length >= 2) {
            const img = await this.fetchImage(p.images[1]);
            doc.image(img, 435, 197, { width: 406, height: 197 });
        }
        if (p.images.length >= 3) {
            const img = await this.fetchImage(p.images[2]);
            doc.image(img, 435, 394, { width: 406, height: 199 });
        }

        // doc = await this.addFooterAndWatermark(doc, withLogo);

        return doc;
    }

    async addFooterAndWatermark(doc: PDFKit.PDFDocument, withLogo = false) {
        if (!withLogo) {
            return doc;
        }

        // footer logo
        doc.rotate(-20);
        doc.image(
            path.join(
                __dirname,
                '..',
                '..',
                '..',
                'static_files',
                'images',
                'signature.png',
            ),
            50,
            560,
            {
                width: 150,
                height: 90,
            },
        );
        doc.rotate(20);

        // watermark
        doc.rotate(90, { origin: [0, 0] });
        doc.image(
            path.join(
                __dirname,
                '..',
                '..',
                '..',
                'static_files',
                'images',
                'g2b-dark.png',
            ),
            250,
            -435,
            {
                width: 100,
                height: 20,
            },
        );
        doc.rotate(-90, { origin: [0, 0] });

        return doc;
    }

    async fetchImage(src: string) {
        const image = await firstValueFrom(
            this.http.get(src, {
                responseType: 'arraybuffer',
            }),
        );
        return image.data;
    }

    getIconImage(fileName: string) {
        return path.join(
            __dirname,
            '..',
            '..',
            '..',
            'static_files',
            'icons',
            fileName,
        );
    }
}
