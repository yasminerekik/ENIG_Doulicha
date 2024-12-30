import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true })
  message: string; // Le message de la notification

  @Prop({ required: true })
  type: string; // Le type de notification (par exemple, "reservation", "alert", etc.)

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  ownerId: Types.ObjectId; // Référence à l'utilisateur propriétaire de la notification

  @Prop({ required: true })
  createdAt: Date; // Date de création de la notification

  @Prop({ type: Types.ObjectId, ref: 'Reservation' })
  reservationId?: Types.ObjectId; // Optionally reference the reservation for comments

  @Prop({ required: true, enum: ['not yet', 'done'], default: 'not yet' })
  etat: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
