import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { QueryMyWishlist, QueryWishlist } from './dto/query-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { JWTTokenPayload } from 'src/shared/types/jwt.types';
import { User } from '../user/entities/user.entity';
import { PromotionProduct } from '../promotion-product/entities/promotion-product.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(Wishlist)
        private wishlistRepository: Repository<Wishlist>,
    ) {}

    create(createWishlistDto: CreateWishlistDto, profile?: JWTTokenPayload) {
        const user = new User();
        user.id = profile.id;
        const promotionProducts = createWishlistDto.promotionProducts.map(
            (e) => {
                const product = new PromotionProduct();
                product.id = e;
                return product;
            },
        );
        const wishlist = this.wishlistRepository.create({
            promotionProducts,
            user,
        });

        return this.wishlistRepository.save(wishlist, {
            reload: true,
        });
    }

    async addToWishlist(
        createWishlistDto: CreateWishlistDto,
        profile?: JWTTokenPayload,
    ) {
        const user = new User();
        user.id = profile.id;
        const wishlist = await this.wishlistRepository.findOne({
            where: { user },
            relations: {
                promotionProducts: true,
            },
            select: {
                promotionProducts: { id: true },
            },
        });
        if (!wishlist) {
            return this.create(createWishlistDto, profile);
        }
        wishlist.promotionProducts = [
            ...wishlist.promotionProducts,
            ...createWishlistDto.promotionProducts.map((e) => {
                const product = new PromotionProduct();
                product.id = e;
                return product;
            }),
        ];
        wishlist.promotionProducts = wishlist.promotionProducts.filter(
            (value, index, self) =>
                index === self.findIndex((t) => t.id === value.id),
        );

        return this.wishlistRepository.save(wishlist, {
            reload: true,
        });
    }

    findAll(query: QueryWishlist) {
        const options: IPaginationOptions = {
            limit: query.limit,
            page: query.page,
        };
        const queryBuilder = this.wishlistRepository.createQueryBuilder('w');
        queryBuilder.orderBy(
            `w.${query.sort_column}`,
            query.sort_direction.toUpperCase() as any,
        );

        queryBuilder.leftJoinAndSelect('w.user', 'u');
        if (!query.populate) {
            queryBuilder.leftJoin('w.promotionProducts', 'p');
            queryBuilder.addSelect(['p.id']);
        } else {
            queryBuilder.leftJoinAndSelect('w.promotionProducts', 'p');
        }

        return paginate<Wishlist>(queryBuilder, options);
    }

    async findOne(query: QueryMyWishlist, profile: JWTTokenPayload) {
        const user = new User();
        user.id = profile.id;
        let wishlist: Wishlist;
        if (query.populate) {
            wishlist = await this.wishlistRepository.findOne({
                where: { user },
                relations: {
                    user: true,
                    promotionProducts: {
                        country: true,
                        city: true,
                        district: true,
                        ward: true,
                    },
                },
            });
        } else {
            wishlist = await this.wishlistRepository.findOne({
                where: { user },
                relations: {
                    user: true,
                    promotionProducts: {
                        country: true,
                        city: true,
                        district: true,
                        ward: true,
                    },
                },
                select: {
                    promotionProducts: { id: true },
                },
            });
        }

        if (!wishlist) {
            const newWishlist = this.wishlistRepository.create({
                promotionProducts: [],
                user,
            });

            return this.wishlistRepository.save(newWishlist, { reload: true });
        }

        return wishlist;
    }

    update(id: string, updateWishlistDto: UpdateWishlistDto) {
        const promotionProducts = updateWishlistDto.promotionProducts.map(
            (e) => {
                const product = new PromotionProduct();
                product.id = e;
                return product;
            },
        );
        return this.wishlistRepository.save(
            { id, promotionProducts },
            { reload: true },
        );
    }

    remove(id: string) {
        return this.wishlistRepository.delete({ id });
    }
}
