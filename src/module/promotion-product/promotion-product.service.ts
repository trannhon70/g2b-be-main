import { Injectable } from '@nestjs/common';
import { CreatePromotionProductDto } from './dto/create-promotion-product.dto';
import { UpdatePromotionProductDto } from './dto/update-promotion-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionProduct } from './entities/promotion-product.entity';
import { Repository } from 'typeorm';
import { QueryPromotionProduct } from './dto/query-promotion-product.dto';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Country } from '../country/entities/country.entity';
import { City } from '../city/entities/city.entity';
import { District } from '../district/entities/district.entity';
import { JWTTokenPayload } from 'src/shared/types/jwt.types';
import { NotificationService } from '../notification/notification.service';
import { User } from '../user/entities/user.entity';
import { Ward } from '../ward/entities/ward.entity';

@Injectable()
export class PromotionProductService {
    constructor(
        @InjectRepository(PromotionProduct)
        private promotionProductRepository: Repository<PromotionProduct>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private notificationService: NotificationService,
    ) {}

    async create(
        createPromotionProductDto: CreatePromotionProductDto,
        profile: JWTTokenPayload,
    ) {
        const country = new Country();
        country.id = createPromotionProductDto.country;
        let promotion = await this.promotionProductRepository.findOneBy({
            slug: createPromotionProductDto.slug,
            deleted: true,
        });
        const city = new City();
        city.id = createPromotionProductDto.city;
        const district = new District();
        district.id = createPromotionProductDto.district;
        const ward = new Ward();
        ward.id = createPromotionProductDto.ward;
        if (promotion) {
            promotion = {
                ...promotion,
                ...createPromotionProductDto,
                city,
                district,
                deleted: false,
                deleted_at: null,
                country,
                ward,
            };
        } else {
            promotion = this.promotionProductRepository.create({
                ...createPromotionProductDto,
                city,
                district,
                country,
                ward,
            });
        }

        const result = await this.promotionProductRepository.save(promotion, {
            reload: true,
        });

        const admins = await this.userRepository.find({
            where: { role: 'ADMIN' },
        });

        await Promise.all(
            admins.map((e) => {
                return this.notificationService.create({
                    notificationType: 'PROMOTION_PRODUCT',
                    content: `Product ${result.title} was created by ${profile.name}`,
                    user: e.id,
                    from: profile.id,
                });
            }),
        );

        return result;
    }

    findAll(query: QueryPromotionProduct) {
        const options: IPaginationOptions = {
            limit: query.limit,
            page: query.page,
        };
        const queryBuilder =
            this.promotionProductRepository.createQueryBuilder('c');
        queryBuilder.orderBy(
            `c.${query.sort_column}`,
            query.sort_direction.toUpperCase() as any,
        );

        if (query.country && query.country !== 'undefined') {
            queryBuilder.andWhere(`c.country = '${query.country}'`);
        }
        if (query.city && query.city !== 'undefined') {
            queryBuilder.andWhere(`c.city = '${query.city}'`);
        }

        if (query.district && query.district !== 'undefined') {
            queryBuilder.andWhere(`c.district = '${query.district}'`);
        }

        if (query.type && query.type !== 'undefined') {
            queryBuilder.andWhere(`c.type = '${query.type}'`);
        }

        if (query.area && query.area.length > 0) {
            queryBuilder.andWhere(`c.area ?| array[:...areas]`, {
                areas: query.area,
            });
        }

        if (!query.populate) {
            queryBuilder.leftJoin('c.country', 'cp');
            queryBuilder.addSelect(['cp.id']);
            queryBuilder.leftJoin('c.city', 'cc');
            queryBuilder.addSelect(['cc.id']);
            queryBuilder.leftJoin('c.district', 'cd');
            queryBuilder.addSelect(['cd.id']);
            queryBuilder.leftJoin('c.ward', 'cw');
            queryBuilder.addSelect(['cw.id']);
        } else {
            queryBuilder.leftJoinAndSelect('c.country', 'cp');
            queryBuilder.leftJoinAndSelect('c.city', 'cc');
            queryBuilder.leftJoinAndSelect('c.district', 'cd');
            queryBuilder.leftJoinAndSelect('c.ward', 'cw');
        }

        queryBuilder.andWhere('c.deleted = false');

        return paginate<PromotionProduct>(queryBuilder, options);
    }

    findOne(id: string) {
        return this.promotionProductRepository.findOne({
            where: { id, deleted: false },
            relations: {
                country: true,
                city: true,
                district: true,
                ward: true,
            },
        });
    }

    findOneBySlug(slug: string) {
        return this.promotionProductRepository.findOne({
            where: {
                slug,
                deleted: false,
            },
            relations: {
                country: true,
                city: true,
                district: true,
                ward: true,
            },
        });
    }

    update(id: string, updatePromotionProductDto: UpdatePromotionProductDto) {
        const country = new Country();
        country.id = updatePromotionProductDto.country;
        const city = new City();
        city.id = updatePromotionProductDto.city;
        const district = new District();
        district.id = updatePromotionProductDto.district;
        const ward = new Ward();
        ward.id = updatePromotionProductDto.ward;
        return this.promotionProductRepository.save({
            id,
            ...updatePromotionProductDto,
            country,
            city,
            district,
            ward,
        });
    }

    remove(id: string) {
        return this.promotionProductRepository.save({
            id,
            deleted: true,
            deleted_at: new Date(),
        });
    }
}
