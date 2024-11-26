import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DestService } from './dest.service';
import { DestController } from './dest.controller';
import { Dest, DestSchema } from '../models/dest.models';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Dest.name, schema: DestSchema }]), UsersModule],
  controllers: [DestController],
  providers: [DestService],
})
export class DestModule {}
