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
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { QueryDistrictDto } from './dto/query-district.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../role/role.decorator';
import { PERMISSIONS } from 'src/shared/enum/role.enum';

@ApiTags('District')
@ApiBearerAuth()
@Controller('district')
export class DistrictController {
    constructor(private readonly districtService: DistrictService) {}

    @Post()
    @Permissions(PERMISSIONS.CREATE_DISTRICT)
    create(@Body() createDistrictDto: CreateDistrictDto) {
        return this.districtService.create(createDistrictDto);
    }

    @Get()
    @Permissions(PERMISSIONS.FIND_ALL_DISTRICT)
    findAll(@Query() query: QueryDistrictDto) {
        return this.districtService.findAll(query);
    }

    @Get(':id')
    @Permissions(PERMISSIONS.FIND_DISTRICT)
    findOne(@Param('id') id: string) {
        return this.districtService.findOne(id);
    }

    @Patch(':id')
    @Permissions(PERMISSIONS.UPDATE_DISTRICT)
    update(
        @Param('id') id: string,
        @Body() updateDistrictDto: UpdateDistrictDto,
    ) {
        return this.districtService.update(id, updateDistrictDto);
    }

    @Delete(':id')
    @Permissions(PERMISSIONS.DELETE_DISTRICT)
    remove(@Param('id') id: string) {
        return this.districtService.remove(id);
    }
}
