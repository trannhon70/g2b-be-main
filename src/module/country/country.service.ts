import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Repository } from 'typeorm';
import { QueryCountryDto } from './dto/query-country.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CountryService {
    constructor(
        @InjectRepository(Country)
        private countryRepository: Repository<Country>,
    ) {}

    async create(createCountryDto: CreateCountryDto) {
        let country = await this.countryRepository.findOneBy({
            code: createCountryDto.code,
            deleted: true,
        });
        if (country) {
            country = {
                ...country,
                ...createCountryDto,
                deleted: false,
                deleted_at: null,
            };
        } else {
            country = this.countryRepository.create({
                ...createCountryDto,
            });
        }

        return this.countryRepository.save(country, {
            reload: true,
        });
    }

    findAll(query: QueryCountryDto) {
        const options: IPaginationOptions = {
            limit: query.limit,
            page: query.page,
        };
        const queryBuilder = this.countryRepository.createQueryBuilder('c');
        queryBuilder.orderBy(
            `c.${query.sort_column}`,
            query.sort_direction.toUpperCase() as any,
        );

        queryBuilder.andWhere('c.deleted = false');

        return paginate<Country>(queryBuilder, options);
    }

    findOne(id: string) {
        return this.countryRepository.findOneBy({
            id,
            deleted: false,
        });
    }

    update(id: string, updateCountryDto: UpdateCountryDto) {
        return this.countryRepository.save({
            id,
            ...updateCountryDto,
        });
    }

    remove(id: string) {
        return this.countryRepository.save({
            id,
            deleted: true,
            deleted_at: new Date(),
        });
    }
}
