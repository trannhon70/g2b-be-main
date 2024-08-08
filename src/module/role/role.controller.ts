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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from './role.decorator';
import { PERMISSIONS } from 'src/shared/enum/role.enum';

@ApiTags('Role')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Permissions(PERMISSIONS.CREATE_ROLE)
    @Post()
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @Get()
    @Permissions(PERMISSIONS.FIND_ALL_ROLE)
    findAll(@Query() query: QueryRoleDto) {
        return this.roleService.findAll(query);
    }

    @Get(':name/byName')
    @Permissions(PERMISSIONS.FIND_ROLE)
    findOneByName(@Param('name') name: string) {
        return this.roleService.findOneByName(name);
    }

    @Get(':id')
    @Permissions(PERMISSIONS.FIND_ROLE)
    findOne(@Param('id') id: string) {
        return this.roleService.findOne(id);
    }

    @Patch(':id')
    @Permissions(PERMISSIONS.UPDATE_ROLE)
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.roleService.update(id, updateRoleDto);
    }

    @Delete(':id')
    @Permissions(PERMISSIONS.DELETE_ROLE)
    remove(@Param('id') id: string) {
        return this.roleService.remove(id);
    }
}
