import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/auth.decorator';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Token')
@ApiBearerAuth()
@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) {}

    @Public()
    @Throttle({ default: { limit: 5, ttl: 300000 } })
    @Post()
    create(@Body() createTokenDto: CreateTokenDto) {
        return this.tokenService.create(createTokenDto);
    }

    @Get()
    findAll() {
        return this.tokenService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tokenService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTokenDto: UpdateTokenDto) {
        return this.tokenService.update(+id, updateTokenDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tokenService.remove(+id);
    }
}
