import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ type: String })
    token: string;
}

export class LoginOTPDto {
    @ApiProperty({ type: String })
    email: string;

    @ApiProperty({ type: String })
    token: string;
}

export class RetrieveTokenDto {
    @ApiProperty({ type: String })
    refreshToken: string;
}
