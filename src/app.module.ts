import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionProductModule } from './module/promotion-product/promotion-product.module';
import { PromotionProduct } from './module/promotion-product/entities/promotion-product.entity';
import { AuthModule } from './module/auth/auth.module';
import { RoleModule } from './module/role/role.module';
import { UserModule } from './module/user/user.module';
import { User } from './module/user/entities/user.entity';
import { Role } from './module/role/entities/role.entity';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmExceptionFilter } from './shared/filter/global.filter';
import { AuthGuard } from './module/auth/auth.guard';
import { RoleGuard } from './module/role/role.guard';
import { WishlistModule } from './module/wishlist/wishlist.module';
import { Wishlist } from './module/wishlist/entities/wishlist.entity';
import { ExcelModule } from './module/excel/excel.module';
import { PdfModule } from './module/pdf/pdf.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ContactModule } from './module/contact/contact.module';
import { Contact } from './module/contact/entities/contact.entity';
import { PowerpointModule } from './module/powerpoint/powerpoint.module';
import { CountryModule } from './module/country/country.module';
import { Country } from './module/country/entities/country.entity';
import { MailerModule } from './module/mailer/mailer.module';
import { TokenModule } from './module/token/token.module';
import { EnvironmentModule } from './module/environment/environment.module';
import { Environment } from './module/environment/entities/environment.entity';
import { Token } from './module/token/entities/token.entity';
import { CityModule } from './module/city/city.module';
import { DistrictModule } from './module/district/district.module';
import { City } from './module/city/entities/city.entity';
import { District } from './module/district/entities/district.entity';
import { NotificationModule } from './module/notification/notification.module';
import { Notification } from './module/notification/entities/notification.entity';
import { WardModule } from './module/ward/ward.module';
import { Ward } from './module/ward/entities/ward.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            load: [configuration],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'static_files'),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('postgres.DB_HOST'),
                port: configService.get<number>('postgres.DB_PORT'),
                username: configService.get<string>('postgres.USERNAME'),
                password: configService.get<string>('postgres.PASSWORD'),
                database: configService.get<string>('postgres.DATABASE'),
                entities: [
                    PromotionProduct,
                    User,
                    Role,
                    Wishlist,
                    Contact,
                    Country,
                    Environment,
                    Token,
                    City,
                    District,
                    Ward,
                    Notification,
                ],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        PromotionProductModule,
        AuthModule,
        RoleModule,
        UserModule,
        WishlistModule,
        ExcelModule,
        PdfModule,
        ContactModule,
        PowerpointModule,
        CountryModule,
        MailerModule,
        TokenModule,
        EnvironmentModule,
        CityModule,
        DistrictModule,
        NotificationModule,
        WardModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: TypeOrmExceptionFilter,
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RoleGuard,
        },
    ],
})
export class AppModule {}
