import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from '../models/notification.models';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ReservationService } from 'src/reservation/reservation.service';
import { Reservation, ReservationSchema } from 'src/models/reservation.models';
import { Dest, DestSchema } from 'src/models/dest.models';
import { DestService } from 'src/dest/dest.service';
import { User, UserSchema } from 'src/models/users.models';
import { UserService } from 'src/users/users.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema },
    { name: Reservation.name, schema: ReservationSchema},
    { name: Dest.name, schema: DestSchema},
    { name: User.name, schema: UserSchema}
  ])],
  providers: [NotificationService, ReservationService, DestService, UserService],
  controllers: [NotificationController],
})
export class NotificationModule {}
