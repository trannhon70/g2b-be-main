import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    googleID?: string = faker.string.alphanumeric(7);

    @ApiProperty({ type: String })
    avatar: string;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String })
    firstname: string;

    @ApiProperty({ type: String })
    lastname: string;

    @ApiProperty({ type: String })
    role?: string;
}
