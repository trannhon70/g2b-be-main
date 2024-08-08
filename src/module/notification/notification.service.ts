import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { JWTTokenPayload } from 'src/shared/types/jwt.types';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
    ) {}

    create(createNotificationDto: CreateNotificationDto) {
        const user = new User();
        user.id = createNotificationDto.user;
        const from = new User();
        from.id = createNotificationDto.from;

        return this.notificationRepository.save(
            {
                ...createNotificationDto,
                user,
                from,
            },
            { reload: true },
        );
    }

    findAll(query: QueryNotificationDto) {
        const options: IPaginationOptions = {
            limit: query.limit,
            page: query.page,
        };
        const queryBuilder =
            this.notificationRepository.createQueryBuilder('c');
        queryBuilder.orderBy(
            `c.${query.sort_column}`,
            query.sort_direction.toUpperCase() as any,
        );

        queryBuilder.andWhere('c.deleted = false');
        if (!query.populate) {
            queryBuilder.leftJoin('c.from', 'cf');
            queryBuilder.addSelect(['cp.id']);
        } else {
            queryBuilder.leftJoinAndSelect('c.from', 'cf');
        }

        return paginate<Notification>(queryBuilder, options);
    }

    findOne(id: string) {
        return this.notificationRepository.findOne({ where: { id } });
    }

    findMine(profile: JWTTokenPayload) {
        return this.notificationRepository.find({
            where: { user: { id: profile.id }, deleted: false, read: false },
            relations: {
                from: true,
            },
        });
    }

    async update(id: string, updateNotificationDto: UpdateNotificationDto) {
        let noti = await this.notificationRepository.findOne({
            where: { id },
        });
        const user = new User();
        user.id = updateNotificationDto.user;
        const from = new User();
        from.id = updateNotificationDto.from;

        noti = {
            ...noti,
            ...updateNotificationDto,
            user,
            from,
        };
        return this.notificationRepository.save(noti);
    }

    remove(id: string) {
        return this.notificationRepository.delete({ id });
    }
}
