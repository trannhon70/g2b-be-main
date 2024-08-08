import { Injectable, Logger } from '@nestjs/common';
import { CreateMailerDto } from './dto/create-mailer.dto';
import { UpdateMailerDto } from './dto/update-mailer.dto';
import SendGrid from '@sendgrid/mail';
import { InjectRepository } from '@nestjs/typeorm';
import { Environment } from '../environment/entities/environment.entity';
import { Repository } from 'typeorm';
import { ENVIRONMENT_VAR } from 'src/shared/enum/enviroment.enum';
import { MailtrapClient } from 'mailtrap';

const logger = new Logger('SendgridService');
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    constructor(
        @InjectRepository(Environment)
        private environmentRepository: Repository<Environment>,
    ) {}

    create(createMailerDto: CreateMailerDto) {
        return 'This action adds a new mailer';
    }

    findAll() {
        return `This action returns all mailer`;
    }

    findOne(id: number) {
        return `This action returns a #${id} mailer`;
    }

    update(id: number, updateMailerDto: UpdateMailerDto) {
        return `This action updates a #${id} mailer`;
    }

    remove(id: number) {
        return `This action removes a #${id} mailer`;
    }

    async send(mail: SendGrid.MailDataRequired) {
        const apiKey = await this.environmentRepository.findOneBy({
            key: ENVIRONMENT_VAR.SENDGRID_API_KEY,
        });
        SendGrid.setApiKey(apiKey.value);
        const transport = await SendGrid.send(mail);

        logger.log(`Email successfully dispatched to ${mail.to}`);
        return transport;
    }

    async sendWithNodeMailer() {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'g2bcloudservices@gmail.com',
                pass: 'matkhaulapassword@123',
            },
        });

        const info = await transporter
            .sendMail({
                from: `g2b`, // sender address //TODO: update
                to: 'fxanhkhoa@gmail.com', // list of receivers
                subject: 'OTP', // Subject
                text: 'OTP is 123456', // plain text body
                //   html: "<b>Hello world?</b>", // html body
            })
            .catch(console.error);

        return info;
    }

    async sendWithMailtrap() {
        const TOKEN = '391899199b418105516198b7e6228c8f';
        const SENDER_EMAIL = 'mailtrap@nicosmetic.com';
        const RECIPIENT_EMAIL = 'fxanhkhoa@gmail.com';

        const client = new MailtrapClient({ token: TOKEN });

        const sender = { name: 'Mailtrap Test', email: SENDER_EMAIL };

        client
            .send({
                from: sender,
                to: [{ email: RECIPIENT_EMAIL }],
                subject: 'Hello from Mailtrap!',
                text: 'Welcome to Mailtrap Sending!',
            })
            .then(console.log)
            .catch(console.error);
    }
}
