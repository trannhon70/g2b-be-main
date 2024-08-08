import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { MailerService } from '../mailer/mailer.service';
import { randomInt } from 'crypto';
import { Token } from './entities/token.entity';
import { User } from '../user/entities/user.entity';
import { add } from 'date-fns';
import { Environment } from '../environment/entities/environment.entity';
import { ENVIRONMENT_VAR } from 'src/shared/enum/enviroment.enum';

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(Token)
        private tokenRepository: Repository<Token>,
        @InjectRepository(Environment)
        private environmentRepository: Repository<Environment>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private mailerService: MailerService,
    ) {}

    async create(createTokenDto: CreateTokenDto) {
        const foundUser = await this.userRepository.findOne({
            where: { email: createTokenDto.email, deleted: false },
        });
        if (!foundUser) {
            throw new ForbiddenException('NO PERMISSION');
        }
        const expiredAt = new Date();
        const number = randomInt(100000, 999999);
        const builder = this.tokenRepository.createQueryBuilder();
        await builder
            .delete()
            .where({ email: createTokenDto.email, type: createTokenDto.type })
            .execute();
        const createToken = await this.tokenRepository.save(
            {
                token: number.toString(),
                email: createTokenDto.email,
                expired: false,
                type: createTokenDto.type,
                expiredAt: add(expiredAt, { minutes: 1 }).toISOString(),
            },
            { reload: true },
        );

        let res = null;
        if (createToken) {
            res = await this.sendEmail(createToken.email, createToken.token);
        }

        if (res) {
            return { result: true };
        } else {
            return { result: false };
        }
    }

    async sendEmail(email: string, otp: string) {
        try {
            const [id, fromSender] = await Promise.all([
                this.environmentRepository.findOneBy({
                    key: ENVIRONMENT_VAR.SENDGRID_OTP_TEMPLATE_ID,
                }),
                this.environmentRepository.findOneBy({
                    key: ENVIRONMENT_VAR.EMAIL_SENDER,
                }),
            ]);
            await this.mailerService.send({
                from: fromSender.value,
                to: email,
                subject: 'G2B: Login OTP',
                templateId: id.value,
                dynamicTemplateData: {
                    otp,
                },
            });
            // await this.mailerService.sendWithMailtrap();
            return {
                result: true,
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(error);
        }
    }

    async verifyOTP(otp: string, type: string, email: string) {
        const currentTime = new Date();
        const foundToken = await this.tokenRepository.findOneBy({
            email,
            expired: false,
            expiredAt: MoreThan(currentTime.toISOString()),
        });
        if (foundToken) {
            foundToken.expired = true;
            const result = await this.tokenRepository.delete({
                id: foundToken.id,
            });
            return result && true;
        }
        return false;
    }

    findAll() {
        return `This action returns all token`;
    }

    findOne(id: number) {
        return `This action returns a #${id} token`;
    }

    update(id: number, updateTokenDto: UpdateTokenDto) {
        return `This action updates a #${id} token`;
    }

    remove(id: number) {
        return `This action removes a #${id} token`;
    }
}
