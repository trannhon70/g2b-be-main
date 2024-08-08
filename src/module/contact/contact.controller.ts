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
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Public } from '../auth/auth.decorator';
import { Permissions } from '../role/role.decorator';
import { PERMISSIONS } from 'src/shared/enum/role.enum';
import { QueryContactDto } from './dto/query-contact.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) {}

    @Public()
    @Post()
    create(@Body() createContactDto: CreateContactDto) {
        return this.contactService.create(createContactDto);
    }

    @Permissions(PERMISSIONS.FIND_ALL_CONTACT)
    @Get()
    findAll(@Query() query: QueryContactDto) {
        return this.contactService.findAll(query);
    }

    @Permissions(PERMISSIONS.FIND_CONTACT)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.contactService.findOne(id);
    }

    @Permissions(PERMISSIONS.UPDATE_CONTACT)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateContactDto: UpdateContactDto,
    ) {
        return this.contactService.update(id, updateContactDto);
    }

    @Permissions(PERMISSIONS.DELETE_CONTACT)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.contactService.remove(id);
    }
}
