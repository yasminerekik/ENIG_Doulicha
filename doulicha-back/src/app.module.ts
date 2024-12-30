import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { DestModule } from './dest/dest.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ReservationModule } from './reservation/reservation.module';
import { NotificationModule } from './notification/notification.module';
import { ResetPasswordService } from './reset-password/reset-password.service';
import { ResetPasswordController } from './reset-password/reset-password.controller';
import { ResetPasswordModule } from './reset-password/reset-password.module';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ,{autoCreate:true}),
    AuthModule,
    UsersModule,
    DestModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Path to your images folder
      serveRoot: '/uploads', // URL path to access files
    }),
    ReservationModule,
    NotificationModule,
    ResetPasswordModule,],
    controllers: [AppController, ResetPasswordController],
    providers: [AppService, ResetPasswordService],
})
export class AppModule {}
