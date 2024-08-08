import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from '../role/role.decorator';
import { PERMISSIONS } from 'src/shared/enum/role.enum';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @Permissions(PERMISSIONS.CREATE_USER)
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @Permissions(PERMISSIONS.FIND_ALL_USER)
    findAll(@Query() query: QueryUserDto) {
        return this.userService.findAll(query);
    }

    @Get(':id')
    @Permissions(PERMISSIONS.FIND_USER)
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @Permissions(PERMISSIONS.UPDATE_USER)
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Request() req: any,
    ) {
        return this.userService.update(id, updateUserDto, req.user);
    }

    @Delete(':id')
    @Permissions(PERMISSIONS.DELETE_USER)
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
