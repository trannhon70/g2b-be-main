import { Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { QueryCityDto } from './dto/query-city.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Country } from '../country/entities/country.entity';

@Injectable()
export class CityService {
    constructor(
        @InjectRepository(City)
        private cityRepository: Repository<City>,
    ) {}

    create(createCityDto: CreateCityDto) {
        const country = new Country();
        country.id = createCityDto.country;
        return this.cityRepository.save(
            { ...createCityDto, country, deleted: false },
            { reload: true },
        );
    }

    findAll(query: QueryCityDto) {
        const options: IPaginationOptions = {
            limit: query.limit,
            page: query.page,
        };
        const queryBuilder = this.cityRepository.createQueryBuilder('c');
        queryBuilder.orderBy(
            `c.${query.sort_column}`,
            query.sort_direction.toUpperCase() as any,
        );

        if (query.country) {
            const country = new Country();
            country.id = query.country;
            queryBuilder.andWhere({ country: country });
        }

        queryBuilder.andWhere('c.deleted = false');
        queryBuilder.leftJoinAndSelect('c.country', 'cc');

        return paginate<City>(queryBuilder, options);
    }

    findOne(id: string) {
        return this.cityRepository.findOne({
            where: { id },
            relations: { country: true },
        });
    }

    update(id: string, updateCityDto: UpdateCityDto) {
        const country = new Country();
        country.id = updateCityDto.country;
        return this.cityRepository.save(
            { id, ...updateCityDto, country },
            { reload: true },
        );
    }

    remove(id: string) {
        return this.cityRepository.delete({ id });
    }
}
