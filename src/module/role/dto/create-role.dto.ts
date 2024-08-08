import { ApiProperty } from '@nestjs/swagger';
import { PERMISSIONS } from 'src/shared/enum/role.enum';

export class CreateRoleDto {
    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: [String], default: Object.values(PERMISSIONS) })
    permissions: string[];
}
