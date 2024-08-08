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
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../role/role.decorator';
import { PERMISSIONS } from 'src/shared/enum/role.enum';
import { QueryMyWishlist, QueryWishlist } from './dto/query-wishlist.dto';

@ApiTags('WishList')
@ApiBearerAuth()
@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) {}

    @Post()
    @Permissions(PERMISSIONS.CREATE_WISHLIST)
    create(@Body() createWishlistDto: CreateWishlistDto, @Request() req: any) {
        return this.wishlistService.create(createWishlistDto, req.user);
    }

    @Post('add')
    @Permissions(PERMISSIONS.CREATE_WISHLIST)
    addToWishlist(
        @Body() createWishlistDto: CreateWishlistDto,
        @Request() req: any,
    ) {
        return this.wishlistService.addToWishlist(createWishlistDto, req.user);
    }

    @Get()
    @Permissions(PERMISSIONS.FIND_ALL_WISHLIST)
    findAll(@Query() query: QueryWishlist) {
        return this.wishlistService.findAll(query);
    }

    @Get('mine')
    @Permissions(PERMISSIONS.FIND_WISHLIST)
    findOne(@Query() query: QueryMyWishlist, @Request() req: any) {
        return this.wishlistService.findOne(query, req.user);
    }

    @Patch(':id')
    @Permissions(PERMISSIONS.UPDATE_WISHLIST)
    update(
        @Param('id') id: string,
        @Body() updateWishlistDto: UpdateWishlistDto,
    ) {
        return this.wishlistService.update(id, updateWishlistDto);
    }

    @Delete(':id')
    @Permissions(PERMISSIONS.DELETE_WISHLIST)
    remove(@Param('id') id: string) {
        return this.wishlistService.remove(id);
    }
}
