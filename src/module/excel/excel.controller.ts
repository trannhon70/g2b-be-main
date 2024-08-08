import { Controller, Post, Body, Res } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { CreateExcelDto } from './dto/excel.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Permissions } from '../role/role.decorator';
import { PERMISSIONS } from 'src/shared/enum/role.enum';

@ApiTags('Excel')
@ApiBearerAuth()
@Controller('excel')
export class ExcelController {
    constructor(private readonly excelService: ExcelService) {}

    @Permissions(PERMISSIONS.FIND_EXCEL)
    @Post()
    create(@Body() createExcelDto: CreateExcelDto, @Res() res: Response) {
        return this.excelService.create(createExcelDto, res);
    }
}
