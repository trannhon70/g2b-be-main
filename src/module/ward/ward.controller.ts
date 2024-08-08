import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { WardService } from './ward.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { QueryWardDto } from './dto/query-ward.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../role/role.decorator';
import { PERMISSIONS } from 'src/shared/enum/role.enum';

@ApiTags('Ward')
@ApiBearerAuth()
@Controller('ward')
export class WardController {
    constructor(private readonly wardService: WardService) {}

    @Post()
    @Permissions(PERMISSIONS.CREATE_WARD)
    create(@Body() createWardDto: CreateWardDto) {
        return this.wardService.create(createWardDto);
    }

    @Get()
    @Permissions(PERMISSIONS.FIND_ALL_WARD)
    findAll(@Query() query: QueryWardDto) {
        return this.wardService.findAll(query);
    }

    @Get(':id')
    @Permissions(PERMISSIONS.FIND_WARD)
    findOne(@Param('id') id: string) {
        return this.wardService.findOne(id);
    }

    @Patch(':id')
    @Permissions(PERMISSIONS.UPDATE_WARD)
    update(@Param('id') id: string, @Body() updateWardDto: UpdateWardDto) {
        return this.wardService.update(id, updateWardDto);
    }

    @Delete(':id')
    @Permissions(PERMISSIONS.DELETE_WARD)
    remove(@Param('id') id: string) {
        return this.wardService.remove(id);
    }
}
