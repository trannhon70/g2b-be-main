import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from '../environment/entities/environment.entity';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([Environment])],
    controllers: [MailerController],
    providers: [MailerService],
    exports: [MailerService],
})
export class MailerModule {}
