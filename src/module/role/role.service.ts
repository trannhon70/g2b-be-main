import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryRoleDto } from './dto/query-role.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) {}

    async create(createRoleDto: CreateRoleDto) {
        let role = await this.roleRepository.findOneBy({
            name: createRoleDto.name,
            deleted: true,
        });
        if (role) {
            role = {
                ...role,
                ...createRoleDto,
                deleted: false,
                deleted_at: null,
            };
        } else {
            role = this.roleRepository.create({
                ...createRoleDto,
            });
        }

        return this.roleRepository.save(role, {
            reload: true,
        });
    }

    findAll(query: QueryRoleDto) {
        const options: IPaginationOptions = {
            limit: query.limit,
            page: query.page,
        };
        const queryBuilder = this.roleRepository.createQueryBuilder('c');
        queryBuilder.orderBy(
            `c.${query.sort_column}`,
            query.sort_direction.toUpperCase() as any,
        );

        queryBuilder.andWhere('c.deleted = false');

        return paginate<Role>(queryBuilder, options);
    }

    findOne(id: string) {
        return this.roleRepository.findOneBy({
            id,
            deleted: false,
        });
    }

    findOneByName(name: string) {
        return this.roleRepository.findOneBy({
            name,
            deleted: false,
        });
    }

    update(id: string, updateRoleDto: UpdateRoleDto) {
        return this.roleRepository.save({
            id,
            ...updateRoleDto,
        });
    }

    remove(id: string) {
        return this.roleRepository.save({
            id,
            deleted: true,
            deleted_at: new Date(),
        });
    }
}
