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
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/auth.decorator';
import { QueryCountryDto } from './dto/query-country.dto';
import { Permissions } from '../role/role.decorator';
import { PERMISSIONS } from 'src/shared/enum/role.enum';

@ApiTags('Country')
@ApiBearerAuth()
@Controller('country')
export class CountryController {
    constructor(private readonly countryService: CountryService) {}

    @Post()
    @Permissions(PERMISSIONS.CREATE_COUNTRY)
    create(@Body() createCountryDto: CreateCountryDto) {
        return this.countryService.create(createCountryDto);
    }

    @Public()
    // @Permissions(PERMISSIONS.FIND_ALL_COUNTRY)
    @Get()
    findAll(@Query() query: QueryCountryDto) {
        return this.countryService.findAll(query);
    }

    @Permissions(PERMISSIONS.FIND_COUNTRY)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.countryService.findOne(id);
    }

    @Patch(':id')
    @Permissions(PERMISSIONS.UPDATE_COUNTRY)
    update(
        @Param('id') id: string,
        @Body() updateCountryDto: UpdateCountryDto,
    ) {
        return this.countryService.update(id, updateCountryDto);
    }

    @Delete(':id')
    @Permissions(PERMISSIONS.DELETE_COUNTRY)
    remove(@Param('id') id: string) {
        return this.countryService.remove(id);
    }
}
