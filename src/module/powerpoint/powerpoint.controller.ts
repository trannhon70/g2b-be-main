import { Controller, Post, Body, Res } from '@nestjs/common';
import { PowerpointService } from './powerpoint.service';
import { CreatePowerpointDto } from './dto/create-powerpoint.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../role/role.decorator';
import { PERMISSIONS } from 'src/shared/enum/role.enum';

@ApiTags('Powerpoint')
@ApiBearerAuth()
@Controller('powerpoint')
export class PowerpointController {
    constructor(private readonly powerpointService: PowerpointService) {}

    @Permissions(PERMISSIONS.FIND_PPT)
    @Post()
    create(
        @Body() createPowerpointDto: CreatePowerpointDto,
        @Res() res: Response,
    ) {
        return this.powerpointService.create(createPowerpointDto, res);
    }
}
