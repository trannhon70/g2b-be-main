import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS } from 'src/shared/enum/role.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: PERMISSIONS[]) =>
    SetMetadata(PERMISSIONS_KEY, permissions);
