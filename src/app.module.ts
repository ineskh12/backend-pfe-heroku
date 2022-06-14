import { TemplatesService } from './templates/templates.service';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import * as path from 'path';
import { NeconfigModule } from 'neconfig';
import { TemplatesModule } from './templates/templates.module';

import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    AuthModule,
    TemplatesModule,

    NeconfigModule.register({
      readers: [{ name: 'env', file: path.resolve(process.cwd(), '.env') }],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: 'ali.obba@esprit.tn',
          pass: '3CHAUEEKYTN4k',
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
