import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { QueryUserDto } from './dto/query-user.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { NotificationService } from '../notification/notification.service';
import { JWTTokenPayload } from 'src/shared/types/jwt.types';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private notificationService: NotificationService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        let user = await this.userRepository.findOneBy({
            email: createUserDto.email,
            deleted: true,
        });
        if (user) {
            user = {
                ...user,
                ...createUserDto,
                deleted: false,
                deleted_at: null,
            };
        } else {
            user = this.userRepository.create({
                ...createUserDto,
            });
        }

        return this.userRepository.save(user, {
            reload: true,
        });
    }

    findAll(query: QueryUserDto) {
        const options: IPaginationOptions = {
            limit: query.limit,
            page: query.page,
        };
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        queryBuilder.orderBy(
            `user.${query.sort_column}`,
            query.sort_direction.toUpperCase() as any,
        );
        if (query.keyword) {
            queryBuilder
                .orWhere(`user.name ilike '%${query.keyword}%'`)
                .orWhere(`user.firstname ilike '%${query.keyword}%'`)
                .orWhere(`user.lastname ilike '%${query.keyword}%'`);
        }

        if (query.email) {
            queryBuilder.andWhere(`user.email = '${query.email}'`);
        }
        if (query.role) {
            queryBuilder.andWhere({ role: query.role });
        }

        queryBuilder.andWhere('user.deleted = false');

        return paginate<User>(queryBuilder, options);
    }

    findOne(id: string) {
        return this.userRepository.findOneBy({ id, deleted: false });
    }

    findByGoogleID(googleID: string) {
        return this.userRepository.findOneBy({ googleID, deleted: false });
    }

    findByEmail(email: string) {
        return this.userRepository.findOneBy({ email, deleted: false });
    }

    async update(
        id: string,
        updateUserDto: UpdateUserDto,
        profile: JWTTokenPayload,
    ) {
        const user = await this.userRepository.save(
            {
                id,
                ...updateUserDto,
            },
            { reload: true },
        );

        const admins = await this.userRepository.find({
            where: { role: 'ADMIN' },
        });

        await Promise.all(
            admins.map((e) => {
                return this.notificationService.create({
                    notificationType: 'PROMOTION_PRODUCT',
                    content: `${user.name} was updated by ${profile.name}`,
                    user: e.id,
                    from: profile.id,
                });
            }),
        );

        return user;
    }

    remove(id: string) {
        return this.userRepository.save(
            {
                id,
                deleted: true,
                deleted_at: new Date(),
            },
            { reload: true },
        );
    }
}
