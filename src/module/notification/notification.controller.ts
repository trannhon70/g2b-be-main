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
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryNotificationDto } from './dto/query-notification.dto';

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    create(@Body() createNotificationDto: CreateNotificationDto) {
        return this.notificationService.create(createNotificationDto);
    }

    @Get()
    findAll(@Query() query: QueryNotificationDto) {
        return this.notificationService.findAll(query);
    }

    @Get('mine')
    findMine(@Request() req: any) {
        return this.notificationService.findMine(req.user);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.notificationService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateNotificationDto: UpdateNotificationDto,
    ) {
        return this.notificationService.update(id, updateNotificationDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.notificationService.remove(id);
    }
}
