import { Injectable } from '@nestjs/common';
import { CreatePowerpointDto } from './dto/create-powerpoint.dto';
import pptxgen from 'pptxgenjs';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionProduct } from '../promotion-product/entities/promotion-product.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import path from 'path';
import { format } from 'date-fns';

const lineColor = 'FDCD27';
const textColor = '#FDCD27';
const descriptionTextColor = '#FFFFFF';
const titleFontSize = 17;
const mainTextFontSize = 9;
const descriptionFontSize = 7;

@Injectable()
export class PowerpointService {
    constructor(
        @InjectRepository(PromotionProduct)
        private promotionProductRepository: Repository<PromotionProduct>,
        private http: HttpService,
    ) {}

    async create(createPowerpointDto: CreatePowerpointDto, res: Response) {
        const promotionProductions = await Promise.all(
            createPowerpointDto.promotionProducts.map((e) =>
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

        let pptx = new pptxgen();
        pptx.author = 'SSR Engineering';
        pptx.company = 'SSR Engineering';
        pptx.revision = '1';
        pptx.subject = 'Products';
        pptx.title = 'G2B Products';

        pptx.layout = 'LAYOUT_16x9';

        // const slide = pptx.addSlide();

        // slide.addImage({
        //     path: path.join(
        //         __dirname,
        //         '..',
        //         '..',
        //         '..',
        //         'static_files',
        //         'images',
        //         'powerpoint-cover.png',
        //     ),
        //     w: '100%',
        //     h: '100%',
        // });

        promotionProductions.forEach((p) => {
            pptx = this.addInformationPage(
                pptx,
                p,
                createPowerpointDto.withLogo,
            );
        });

        const data = await pptx.stream();
        const fileName = 'g2b.pptx';
        res.writeHead(200, {
            'Content-disposition': 'attachment;filename=' + fileName,
            'Content-Length': (data as any).length,
        });
        res.end(Buffer.from(data as any, 'binary'));
        return;
    }

    addImagesPage(slide: pptxgen.Slide, p: PromotionProduct, withLogo = false) {
        if (p.images.length >= 1) {
            slide.addImage({
                path: p.images[0],
                x: '52.5%',
                y: '0%',
                w: '47.5%',
                h: '33%',
            });
        }

        if (p.images.length >= 2) {
            slide.addImage({
                path: p.images[1],
                x: '52.5%',
                y: '33%',
                w: '47.5%',
                h: '33%',
            });
        }

        if (p.images.length >= 3) {
            slide.addImage({
                path: p.images[2],
                x: '52.5%',
                y: '66%',
                w: '47.5%',
                h: '33.8%',
            });
        }

        slide = this.addFooterAndWatermark(slide, withLogo);
        return slide;
    }

    addInformationPage(pptx: pptxgen, p: PromotionProduct, withLogo = false) {
        let slide = pptx.addSlide();
        const texts = p.title.split(' ');
        texts.pop();

        slide.background = { color: '000000' };

        slide.addText(p.title.toUpperCase(), {
            x: '2%',
            y: '5%',
            w: '47%',
            align: 'center',
            color: '#FFFFFF',
            bold: true,
            fontFace: 'Inter',
            fontSize: titleFontSize,
            charSpacing: 5,
        });

        slide.addText('', {
            shape: pptx.ShapeType.line,
            line: { color: lineColor, width: 2, dashType: 'solid' },
            x: '0%',
            y: `12%`,
            w: '50%',
        });

        let startY = 17;
        const step = 2.6;

        // ADDRESS
        slide.addImage({
            path: this.getIconImage('address.png'),
            x: '4.5%',
            y: `${startY - 0.7}%`,
            w: '2%',
            h: '3%',
        });
        slide.addText('ADDRESS', {
            x: '7%',
            y: `${startY}%`,
            w: '40%',
            align: 'left',
            color: textColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: mainTextFontSize,
        });
        slide.addText(
            `${p?.address_detail} ${p?.street}, ${p?.ward.name}, ${p?.district.name}, ${p?.city.name}, ${p?.country.name}`,
            {
                x: '7%',
                y: `${startY + step}%`,
                w: '47%',
                align: 'left',
                color: descriptionTextColor,
                bold: false,
                fontFace: 'Inter',
                fontSize: descriptionFontSize,
            },
        );

        // CITY
        startY += 2 * step;
        slide.addImage({
            path: this.getIconImage('city.png'),
            x: '4.5%',
            y: `${startY - 0.7}%`,
            w: '2%',
            h: '3%',
        });
        slide.addText('CITY', {
            x: '7%',
            y: `${startY}%`,
            w: '30%',
            align: 'left',
            color: textColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: mainTextFontSize,
        });
        slide.addText(`${p.city.name}`, {
            x: '7%',
            y: `${startY + step}%`,
            w: '47%',
            align: 'left',
            color: descriptionTextColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: descriptionFontSize,
        });

        // DESCRIPTION
        startY += 2 * step;
        slide.addImage({
            path: this.getIconImage('description.png'),
            x: '4.5%',
            y: `${startY - 0.7}%`,
            w: '2%',
            h: '3%',
        });
        slide.addText('DESCRIPTION', {
            x: '7%',
            y: `${startY}%`,
            w: '46%',
            align: 'left',
            color: textColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: mainTextFontSize,
        });
        slide.addText(`${p.location_description}`, {
            x: '7%',
            y: `${startY + step - 0.7}%`,
            w: '43%',
            h: `${3.5 * step}%`,
            align: 'left',
            color: descriptionTextColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: descriptionFontSize,
        });

        // DIMENSION
        startY += 5 * step;
        slide.addImage({
            path: this.getIconImage('dimension.png'),
            x: '4.5%',
            y: `${startY - 0.7}%`,
            w: '2%',
            h: '3%',
        });
        slide.addText('DIMENSION', {
            x: '7%',
            y: `${startY}%`,
            w: '47%',
            align: 'left',
            color: textColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: mainTextFontSize,
        });
        slide.addText(`${p.width}m (horizontal) x ${p.height}m (height)`, {
            x: '7%',
            y: `${startY + step}%`,
            w: '47%',
            align: 'left',
            color: descriptionTextColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: descriptionFontSize,
        });

        // PIXEL
        startY += 2 * step;
        slide.addImage({
            path: this.getIconImage('pixel.png'),
            x: '4.5%',
            y: `${startY - 0.7}%`,
            w: '2%',
            h: '3%',
        });
        slide.addText('PIXEL', {
            x: '7%',
            y: `${startY}%`,
            w: '47%',
            align: 'left',
            color: textColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: mainTextFontSize,
        });
        slide.addText(`- ${p.pixelWidth} x ${p.pixelHeight}`, {
            x: '7%',
            y: `${startY + step}%`,
            w: '47%',
            align: 'left',
            color: descriptionTextColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: descriptionFontSize,
        });

        // OPERATION TIME
        startY += 2 * step;
        slide.addImage({
            path: this.getIconImage('operation-time.png'),
            x: '4.5%',
            y: `${startY - 0.7}%`,
            w: '2%',
            h: '3%',
        });
        slide.addText('OPERATION TIME', {
            x: '7%',
            y: `${startY}%`,
            w: '47%',
            align: 'left',
            color: textColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: mainTextFontSize,
        });
        slide.addText(
            `- ${format(p.operationTimeFrom, 'HH:mm')} - ${format(p.operationTimeTo, 'HH:mm z')}`,
            {
                x: '7%',
                y: `${startY + step}%`,
                w: '47%',
                align: 'left',
                color: descriptionTextColor,
                bold: false,
                fontFace: 'Inter',
                fontSize: descriptionFontSize,
            },
        );

        // FREQUENCY
        startY += 2 * step;
        slide.addImage({
            path: this.getIconImage('frequency.png'),
            x: '4.5%',
            y: `${startY - 0.7}%`,
            w: '2%',
            h: '3%',
        });
        slide.addText('FREQUENCY', {
            x: '7%',
            y: `${startY}%`,
            w: '47%',
            align: 'left',
            color: textColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: mainTextFontSize,
        });
        slide.addText(`${p.frequency} spots`, {
            x: '7%',
            y: `${startY + step}%`,
            w: '47%',
            align: 'left',
            color: descriptionTextColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: descriptionFontSize,
        });

        // VIDEO DURATION
        startY += 2 * step;
        slide.addImage({
            path: this.getIconImage('video_duration.png'),
            x: '4.5%',
            y: `${startY - 0.7}%`,
            w: '2%',
            h: '3%',
        });
        slide.addText('VIDEO DURATION', {
            x: '7%',
            y: `${startY}%`,
            w: '47%',
            align: 'left',
            color: textColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: mainTextFontSize,
        });
        slide.addText(`${p.videoDuration}`, {
            x: '7%',
            y: `${startY + step}%`,
            w: '47%',
            align: 'left',
            color: descriptionTextColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: descriptionFontSize,
        });

        // TRAFFIC
        startY += 2 * step;
        slide.addImage({
            path: this.getIconImage('traffic.png'),
            x: '4.5%',
            y: `${startY - 0.7}%`,
            w: '2%',
            h: '3%',
        });
        slide.addText('TRAFFIC', {
            x: '7%',
            y: `${startY}%`,
            w: '47%',
            align: 'left',
            color: textColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: mainTextFontSize,
        });
        slide.addText(`${p.traffic} vehicles/day`, {
            x: '7%',
            y: `${startY + step}%`,
            w: '47%',
            align: 'left',
            color: descriptionTextColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: descriptionFontSize,
        });

        // COST
        startY += 2 * step;
        slide.addImage({
            path: this.getIconImage('cost.png'),
            x: '4.5%',
            y: `${startY - 0.7}%`,
            w: '2%',
            h: '3%',
        });
        slide.addText('COST', {
            x: '7%',
            y: `${startY}%`,
            w: '47%',
            align: 'left',
            color: textColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: mainTextFontSize,
        });
        slide.addText(`${p.cost_in_text}`, {
            x: '7%',
            y: `${startY + step}%`,
            w: '47%',
            align: 'left',
            color: descriptionTextColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: descriptionFontSize,
        });

        // CODE
        startY += 2 * step;
        slide.addImage({
            path: this.getIconImage('code.png'),
            x: '4.5%',
            y: `${startY - 0.7}%`,
            w: '2%',
            h: '3%',
        });
        slide.addText('CODE', {
            x: '7%',
            y: `${startY}%`,
            w: '47%',
            align: 'left',
            color: textColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: mainTextFontSize,
        });
        slide.addText(`${p.sku}`, {
            x: '7%',
            y: `${startY + step}%`,
            w: '47%',
            align: 'left',
            color: descriptionTextColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: descriptionFontSize,
        });

        // FILE FORMAT
        startY += 2 * step;
        slide.addImage({
            path: this.getIconImage('TYPE.png'),
            x: '4.5%',
            y: `${startY - 0.7}%`,
            w: '2%',
            h: '3%',
        });
        slide.addText('FILE FORMAT', {
            x: '7%',
            y: `${startY}%`,
            w: '47%',
            align: 'left',
            color: textColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: mainTextFontSize,
        });
        slide.addText(`${p.type.replace('_', ' ')}`, {
            x: '7%',
            y: `${startY + step}%`,
            w: '47%',
            align: 'left',
            color: descriptionTextColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: descriptionFontSize,
        });

        // AD SIDE
        startY += 2 * step;
        slide.addImage({
            path: this.getIconImage('Adside.png'),
            x: '4.5%',
            y: `${startY - 0.7}%`,
            w: '2%',
            h: '3%',
        });
        slide.addText('AD SIDE', {
            x: '7%',
            y: `${startY}%`,
            w: '47%',
            align: 'left',
            color: textColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: mainTextFontSize,
        });
        slide.addText(`${p.adSide}`, {
            x: '7%',
            y: `${startY + step}%`,
            w: '47%',
            align: 'left',
            color: descriptionTextColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: descriptionFontSize,
        });

        // AREAS
        startY += 2 * step;
        slide.addImage({
            path: this.getIconImage('Areas.png'),
            x: '4.5%',
            y: `${startY - 0.7}%`,
            w: '2%',
            h: '3%',
        });
        slide.addText('AREAS', {
            x: '7%',
            y: `${startY}%`,
            w: '47%',
            align: 'left',
            color: textColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: mainTextFontSize,
        });
        slide.addText(`${p.area.join(', ')}`, {
            x: '7%',
            y: `${startY + step}%`,
            w: '47%',
            align: 'left',
            color: descriptionTextColor,
            bold: false,
            fontFace: 'Inter',
            fontSize: descriptionFontSize,
        });

        slide.addText('', {
            shape: pptx.ShapeType.line,
            line: { color: lineColor, width: 20, dashType: 'solid' },
            x: '51.5%',
            y: `0%`,
            w: 0,
            h: '100%',
        });

        slide = this.addImagesPage(slide, p, withLogo);
        slide = this.addFooterAndWatermark(slide, withLogo);
        return pptx;
    }

    addFooterAndWatermark(slide: pptxgen.Slide, withLogo = false) {
        if (!withLogo) {
            return slide;
        }
        // footer signature
        slide.addImage({
            path: path.join(
                __dirname,
                '..',
                '..',
                '..',
                'static_files',
                'images',
                'signature.png',
            ),
            x: '35%',
            y: '85%',
            w: '14%',
            h: '8%',
            rotate: -30,
        });

        // watermark
        slide.addImage({
            path: path.join(
                __dirname,
                '..',
                '..',
                '..',
                'static_files',
                'images',
                'g2b-dark.png',
            ),
            x: '46.7%',
            y: '50%',
            w: '9%',
            h: '4%',
            rotate: 90,
        });

        return slide;
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
