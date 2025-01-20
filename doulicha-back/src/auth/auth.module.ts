import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../models/users.models';
import { JwtStrategy } from './jwt-strategy';
import { UsersModule } from 'src/users/users.module'; // Assurez-vous que UsersModule est importé
import { PassportModule } from '@nestjs/passport';
import { ResetPasswordService } from 'src/reset-password/reset-password.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // Assurez-vous d'utiliser 'jwt' comme stratégie par défaut
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule, // Importez UsersModule pour que UserService soit disponible
  ],
  providers: [AuthService, JwtStrategy, ResetPasswordService],
  controllers: [AuthController],
})
export class AuthModule {}
