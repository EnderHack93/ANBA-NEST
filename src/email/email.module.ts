import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailController } from './email.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [    
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport:{
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT),
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        }
    }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
