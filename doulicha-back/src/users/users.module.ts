import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; 
import { User, UserSchema } from '../models/users.models';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UsersModule {}
