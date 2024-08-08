import { Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { QueryDistrictDto } from './dto/query-district.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from './entities/district.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { City } from '../city/entities/city.entity';

@Injectable()
export class DistrictService {
    constructor(
        @InjectRepository(District)
        private districtRepository: Repository<District>,
    ) {}
    create(createDistrictDto: CreateDistrictDto) {
        const city = new City();
        city.id = createDistrictDto.city;
        return this.districtRepository.save(
            {
                ...createDistrictDto,
                city,
                deleted: false,
            },
            { reload: true },
        );
    }

    findAll(query: QueryDistrictDto) {
        const options: IPaginationOptions = {
            limit: query.limit,
            page: query.page,
        };
        const queryBuilder = this.districtRepository.createQueryBuilder('c');
        queryBuilder.orderBy(
            `c.${query.sort_column}`,
            query.sort_direction.toUpperCase() as any,
        );

        if (query.city) {
            const city = new City();
            city.id = query.city;
            queryBuilder.andWhere({ city: city });
        }

        queryBuilder.andWhere('c.deleted = false');
        queryBuilder.leftJoinAndSelect('c.city', 'cc');

        return paginate<District>(queryBuilder, options);
    }

    findOne(id: string) {
        return this.districtRepository.findOne({
            where: { id },
            relations: { city: true },
        });
    }

    update(id: string, updateDistrictDto: UpdateDistrictDto) {
        const city = new City();
        city.id = updateDistrictDto.city;
        return this.districtRepository.save({ id, ...updateDistrictDto, city });
    }

    remove(id: string) {
        return this.districtRepository.delete({ id });
    }
}
