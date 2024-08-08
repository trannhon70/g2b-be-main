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
import { PromotionProductService } from './promotion-product.service';
import { CreatePromotionProductDto } from './dto/create-promotion-product.dto';
import { UpdatePromotionProductDto } from './dto/update-promotion-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryPromotionProduct } from './dto/query-promotion-product.dto';
import { Permissions } from '../role/role.decorator';
import { PERMISSIONS } from 'src/shared/enum/role.enum';

@ApiTags('promotion-product')
@ApiBearerAuth()
@Controller('promotion-product')
export class PromotionProductController {
    constructor(
        private readonly promotionProductService: PromotionProductService,
    ) {}

    @Permissions(PERMISSIONS.CREATE_PROMOTION_PRODUCT)
    @Post()
    create(
        @Body() createPromotionProductDto: CreatePromotionProductDto,
        @Request() req: any,
    ) {
        return this.promotionProductService.create(
            createPromotionProductDto,
            req.user,
        );
    }

    @Permissions(PERMISSIONS.FIND_ALL_PROMOTION_PRODUCT)
    @Get()
    findAll(@Query() query: QueryPromotionProduct) {
        return this.promotionProductService.findAll(query);
    }

    @Permissions(PERMISSIONS.FIND_PROMOTION_PRODUCT)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.promotionProductService.findOne(id);
    }

    @Permissions(PERMISSIONS.FIND_PROMOTION_PRODUCT)
    @Get('slug/:slug')
    findOneBySlug(@Param('slug') slug: string) {
        return this.promotionProductService.findOneBySlug(slug);
    }

    @Permissions(PERMISSIONS.UPDATE_PROMOTION_PRODUCT)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePromotionProductDto: UpdatePromotionProductDto,
    ) {
        return this.promotionProductService.update(
            id,
            updatePromotionProductDto,
        );
    }

    @Permissions(PERMISSIONS.DELETE_PROMOTION_PRODUCT)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.promotionProductService.remove(id);
    }
}
