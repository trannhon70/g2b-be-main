import {
    BadRequestException,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, LoginOTPDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import {
    JWTRefreshTokenPayload,
    JWTTokenPayload,
} from 'src/shared/types/jwt.types';
import { Observable, catchError, concatMap, from, of } from 'rxjs';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { TokenService } from '../token/token.service';
import { TOKEN_TYPE } from 'src/shared/enum/enviroment.enum';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
    private client = new OAuth2Client({
        clientId: this.configService.get('google.clientID'),
        clientSecret: this.configService.get('google.clientSecret'),
        redirectUri: this.configService.get('google.redirectURI'),
    });

    constructor(
        private configService: ConfigService,
        private userService: UserService,
        private jwtService: JwtService,
        private tokenService: TokenService,
    ) {}

    async loginByGoogle(dto: LoginDto) {
        try {
            const decodedToken = await this.verify(dto.token);
            return this.generateRefreshTokenGoogle(decodedToken).pipe(
                concatMap((refreshToken) => {
                    return this.generateToken(refreshToken);
                }),
            );
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    async loginByOTP(dto: LoginOTPDto) {
        const verified = await this.tokenService.verifyOTP(
            dto.token,
            TOKEN_TYPE.OTP,
            dto.email,
        );
        try {
            if (verified) {
                const decodedToken: TokenPayload = {
                    email: dto.email,
                    name: dto.email,
                    sub: randomUUID(),
                    picture: '',
                    iss: '',
                    aud: '',
                    iat: 0,
                    exp: 0,
                };
                return this.generateRefreshTokenOTP(decodedToken).pipe(
                    concatMap((refreshToken) => {
                        return this.generateToken(refreshToken);
                    }),
                );
            } else {
                throw new UnauthorizedException();
            }
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    generateToken(
        refreshToken: string,
    ): Observable<{ token: string; refreshToken: string }> {
        try {
            const decodedToken: JWTRefreshTokenPayload = this.jwtService.verify(
                refreshToken,
                {
                    secret: this.configService.get('jwt.secretKey'),
                },
            );
            return from(this.userService.findOne(decodedToken.id)).pipe(
                concatMap((user) => {
                    const payload: JWTTokenPayload = {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        avatar: user.avatar,
                        role: user.role,
                    };
                    return of({
                        token: this.jwtService.sign(payload, {
                            secret: this.configService.get('jwt.secretKey'),
                            expiresIn:
                                this.configService.get('jwt.expiredTime'),
                        }),
                        refreshToken,
                    });
                }),
            );
        } catch (error) {
            return of({
                token: null,
                refreshToken: null,
            });
        }
    }

    private generateRefreshTokenGoogle(tokenPayload: TokenPayload) {
        return from(this.userService.findByGoogleID(tokenPayload.sub)).pipe(
            catchError((err) => {
                Logger.error(`${err} => user not found`);
                const dto: CreateUserDto = {
                    email: tokenPayload.email,
                    name: tokenPayload.name,
                    googleID: tokenPayload.sub,
                    avatar: tokenPayload.picture,
                    firstname: '',
                    lastname: '',
                };
                return this.userService.create(dto);
            }),
            concatMap((user: User) => {
                if (!user) {
                    Logger.error(`user not found => Creating one`);
                    const dto: CreateUserDto = {
                        email: tokenPayload.email,
                        name: tokenPayload.name,
                        googleID: tokenPayload.sub,
                        avatar: tokenPayload.picture,
                        firstname: '',
                        lastname: '',
                    };
                    return of(this.userService.create(dto));
                }
                return of(user);
            }),
            concatMap(async (user: Promise<User>) => {
                const newUser = await user;
                return this.createPayload(newUser);
            }),
        );
    }

    private generateRefreshTokenOTP(tokenPayload: TokenPayload) {
        return from(this.userService.findByEmail(tokenPayload.email)).pipe(
            catchError((err) => {
                Logger.error(`${err} => user not found`);
                const dto: CreateUserDto = {
                    email: tokenPayload.email,
                    name: tokenPayload.name,
                    googleID: tokenPayload.sub,
                    avatar: tokenPayload.picture,
                    firstname: '',
                    lastname: '',
                };
                return this.userService.create(dto);
            }),
            concatMap((user: User) => {
                if (!user) {
                    Logger.error(`user not found => Creating one`);
                    const dto: CreateUserDto = {
                        email: tokenPayload.email,
                        name: tokenPayload.name,
                        googleID: tokenPayload.sub,
                        avatar: tokenPayload.picture,
                        firstname: '',
                        lastname: '',
                    };
                    return of(this.userService.create(dto));
                }
                return of(user);
            }),
            concatMap(async (user: Promise<User>) => {
                const newUser = await user;
                return this.createPayload(newUser);
            }),
        );
    }

    createPayload(user: User) {
        const payload = {
            id: user.id,
            email: user.email,
        };
        return this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.secretKey'),
            expiresIn: this.configService.get('jwt.refreshTokenExpiredTime'),
        });
    }

    private async verify(token: string) {
        try {
            // Google Auth
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: this.configService.get('google.clientID'),
            });
            const payload = ticket.getPayload();
            return payload;
        } catch (error) {
            Logger.error(error);
            throw new BadRequestException(error);
        }
    }
}
