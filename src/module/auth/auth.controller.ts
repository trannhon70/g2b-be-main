import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, LoginOTPDto, RetrieveTokenDto } from './dto/auth.dto';
import { Public } from './auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('login-google')
    login(@Body() loginDto: LoginDto) {
        return this.authService.loginByGoogle(loginDto);
    }

    @Public()
    @Post('login/otp')
    loginOTP(@Body() loginDto: LoginOTPDto) {
        return this.authService.loginByOTP(loginDto);
    }

    @Public()
    @Post('retrieve-token')
    retrieveToken(@Body() retrieveTokenDto: RetrieveTokenDto) {
        return this.authService.generateToken(retrieveTokenDto.refreshToken);
    }

    @Get('verify')
    verify() {
        return { ok: true };
    }
}
