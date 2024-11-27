import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { DestModule } from './dest/dest.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ,{autoCreate:true}),
    AuthModule,
    UsersModule,
    DestModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Path to your images folder
      serveRoot: '/uploads', // URL path to access files
    }),],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
