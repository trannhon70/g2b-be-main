import { Injectable } from '@nestjs/common';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ward } from './entities/ward.entity';
import { Repository } from 'typeorm';
import { QueryWardDto } from './dto/query-ward.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { District } from '../district/entities/district.entity';

@Injectable()
export class WardService {
    constructor(
        @InjectRepository(Ward)
        private wardRepository: Repository<Ward>,
    ) {}

    create(createWardDto: CreateWardDto) {
        const district = new District();
        district.id = createWardDto.district;
        return this.wardRepository.save(
            {
                ...createWardDto,
                deleted: false,
                district,
            },
            { reload: false },
        );
    }

    findAll(query: QueryWardDto) {
        const options: IPaginationOptions = {
            limit: query.limit,
            page: query.page,
        };
        const queryBuilder = this.wardRepository.createQueryBuilder('c');
        queryBuilder.orderBy(
            `c.${query.sort_column}`,
            query.sort_direction.toUpperCase() as any,
        );

        if (query.district) {
            const district = new District();
            district.id = query.district;
            queryBuilder.andWhere({ district: district });
        }

        queryBuilder.andWhere('c.deleted = false');
        queryBuilder.leftJoinAndSelect('c.district', 'cd');

        return paginate<Ward>(queryBuilder, options);
    }

    findOne(id: string) {
        return this.wardRepository.findOne({
            where: { id },
            relations: { district: true },
        });
    }

    update(id: string, updateWardDto: UpdateWardDto) {
        const district = new District();
        district.id = updateWardDto.district;
        return this.wardRepository.save(
            { id, ...updateWardDto, district },
            { reload: true },
        );
    }

    remove(id: string) {
        return this.wardRepository.delete(id);
    }
}
