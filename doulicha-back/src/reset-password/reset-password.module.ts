import { Module } from '@nestjs/common';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from './reset-password.service';
import { UserService } from '../users/users.service';  // Assurez-vous que le service User est importé
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/users.models';
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [
    UsersModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema}
        ]),
      ],
  controllers: [ResetPasswordController],  // Le contrôleur est bien inclus ici
  providers: [ResetPasswordService, UserService],  // Assurez-vous que le service est bien injecté
})
export class ResetPasswordModule {}
