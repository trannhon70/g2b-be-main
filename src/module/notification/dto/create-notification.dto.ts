import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
    @ApiProperty({ type: String })
    notificationType: string;

    @ApiProperty({ type: String })
    content: string;

    @ApiProperty({ type: String })
    user: string;

    @ApiProperty({ type: String })
    from: string;

    @ApiProperty({ type: Boolean, required: false })
    read?: boolean;
}
