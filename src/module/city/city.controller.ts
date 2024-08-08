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
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { Public } from '../auth/auth.decorator';
import { QueryCityDto } from './dto/query-city.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('City')
@ApiBearerAuth()
@Controller('city')
export class CityController {
    constructor(private readonly cityService: CityService) {}

    @Post()
    create(@Body() createCityDto: CreateCityDto) {
        return this.cityService.create(createCityDto);
    }

    @Public()
    @Get()
    findAll(@Query() query: QueryCityDto) {
        return this.cityService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cityService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
        return this.cityService.update(id, updateCityDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cityService.remove(id);
    }
}
