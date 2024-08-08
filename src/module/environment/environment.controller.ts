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
import { EnvironmentService } from './environment.service';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../role/role.decorator';
import { PERMISSIONS } from 'src/shared/enum/role.enum';
import { QueryEnvironmentDto } from './dto/query-environment.dto';

@ApiTags('Environment')
@ApiBearerAuth()
@Controller('environment')
export class EnvironmentController {
    constructor(private readonly environmentService: EnvironmentService) {}

    @Post()
    @Permissions(PERMISSIONS.CREATE_ENVIRONMENT)
    create(@Body() createEnvironmentDto: CreateEnvironmentDto) {
        return this.environmentService.create(createEnvironmentDto);
    }

    @Get()
    @Permissions(PERMISSIONS.FIND_ALL_ENVIRONMENT)
    findAll(@Query() query: QueryEnvironmentDto) {
        return this.environmentService.findAll(query);
    }

    @Get(':id')
    @Permissions(PERMISSIONS.FIND_ENVIRONMENT)
    findOne(@Param('id') id: string) {
        return this.environmentService.findOne(id);
    }

    @Patch(':id')
    @Permissions(PERMISSIONS.UPDATE_ENVIRONMENT)
    update(
        @Param('id') id: string,
        @Body() updateEnvironmentDto: UpdateEnvironmentDto,
    ) {
        return this.environmentService.update(id, updateEnvironmentDto);
    }

    @Delete(':id')
    @Permissions(PERMISSIONS.DELETE_ENVIRONMENT)
    remove(@Param('id') id: string) {
        return this.environmentService.remove(id);
    }
}
