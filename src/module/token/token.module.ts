import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { MailerModule } from '../mailer/mailer.module';
import { Environment } from '../environment/entities/environment.entity';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Token, Environment, User]),
        MailerModule,
    ],
    controllers: [TokenController],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {}
