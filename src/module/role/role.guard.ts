import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RoleService } from './role.service';
import { JWTTokenPayload } from 'src/shared/types/jwt.types';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './role.decorator';
import { PERMISSIONS } from 'src/shared/enum/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private roleService: RoleService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<
            PERMISSIONS[]
        >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: JWTTokenPayload = request['user'];
        const role = await this.roleService.findOneByName(user.role);
        return this.checkRole(role.permissions, requiredPermissions);
    }

    checkRole = (listPermission: string[], requiredPermissions: string[]) => {
        let result = true;
        requiredPermissions.forEach((r) => {
            if (!listPermission.find((e) => e === r)) {
                result = false;
            }
        });
        return result;
    };
}
