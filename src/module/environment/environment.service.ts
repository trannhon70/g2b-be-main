import { Injectable } from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Environment } from './entities/environment.entity';
import { Repository } from 'typeorm';
import { QueryEnvironmentDto } from './dto/query-environment.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class EnvironmentService {
    constructor(
        @InjectRepository(Environment)
        private environmentRepository: Repository<Environment>,
    ) {}

    create(createEnvironmentDto: CreateEnvironmentDto) {
        return this.environmentRepository.save(createEnvironmentDto, {
            reload: true,
        });
    }

    findAll(query: QueryEnvironmentDto) {
        const options: IPaginationOptions = {
            limit: query.limit,
            page: query.page,
        };
        const queryBuilder = this.environmentRepository.createQueryBuilder('c');
        queryBuilder.orderBy(
            `c.${query.sort_column}`,
            query.sort_direction.toUpperCase() as any,
        );

        queryBuilder.andWhere('c.deleted = false');

        return paginate<Environment>(queryBuilder, options);
    }

    findOne(id: string) {
        return this.environmentRepository.findOneBy({ id, deleted: false });
    }

    update(id: string, updateEnvironmentDto: UpdateEnvironmentDto) {
        return this.environmentRepository.save(
            {
                id,
                ...updateEnvironmentDto,
            },
            { reload: true },
        );
    }

    remove(id: string) {
        return this.environmentRepository.save(
            {
                id,
                deleted: true,
                deleted_at: new Date(),
            },
            { reload: true },
        );
    }
}
