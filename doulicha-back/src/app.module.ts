import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { DestModule } from './dest/dest.module';



@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ,{autoCreate:true}),
    AuthModule,
    UsersModule,
    DestModule,],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
