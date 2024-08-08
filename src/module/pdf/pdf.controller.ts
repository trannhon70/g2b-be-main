import { Controller, Post, Body, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { CreatePdfDto } from './dto/pdf.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../role/role.decorator';
import { PERMISSIONS } from 'src/shared/enum/role.enum';

@ApiTags('pdf')
@ApiBearerAuth()
@Controller('pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService) {}

    @Permissions(PERMISSIONS.FIND_PDF)
    @Post()
    create(@Body() createPdfDto: CreatePdfDto, @Res() res: Response) {
        return this.pdfService.create(createPdfDto, res);
    }
}
