import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation, ReservationSchema } from '../models/reservation.models';
import { NotificationService } from 'src/notification/notification.service';
import { Notification, NotificationSchema } from '../models/notification.models';
import { Dest, DestSchema } from 'src/models/dest.models';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reservation.name, schema: ReservationSchema},
    { name: Notification.name, schema: NotificationSchema},
    { name: Dest.name, schema: DestSchema}
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService,NotificationService],
})
export class ReservationModule {}
