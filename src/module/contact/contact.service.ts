import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryContactDto } from './dto/query-contact.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>,
    ) {}

    async create(createContactDto: CreateContactDto) {
        return this.contactRepository.save(createContactDto, {
            reload: true,
        });
    }

    findAll(query: QueryContactDto) {
        const options: IPaginationOptions = {
            limit: query.limit,
            page: query.page,
        };
        const queryBuilder = this.contactRepository.createQueryBuilder('c');
        queryBuilder.orderBy(
            `c.${query.sort_column}`,
            query.sort_direction.toUpperCase() as any,
        );
        if (query.keyword) {
            queryBuilder
                .orWhere(`c.content ilike '%${query.keyword}%'`)
                .orWhere(`c.name ilike '%${query.keyword}%'`)
                .orWhere(`c.email ilike '%${query.keyword}%'`);
        }

        queryBuilder.andWhere('c.deleted = false');

        return paginate<Contact>(queryBuilder, options);
    }

    findOne(id: string) {
        return this.contactRepository.findOneBy({ id, deleted: false });
    }

    update(id: string, updateContactDto: UpdateContactDto) {
        return this.contactRepository.save(
            {
                id,
                ...updateContactDto,
            },
            { reload: true },
        );
    }

    remove(id: string) {
        return this.contactRepository.save(
            {
                id,
                deleted: true,
                deleted_at: new Date(),
            },
            { reload: true },
        );
    }
}
