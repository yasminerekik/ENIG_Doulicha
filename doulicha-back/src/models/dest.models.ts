import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DestDocument = Dest & Document;

@Schema()
export class Dest {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, unique: true })
  address: string;

  @Prop({ required: true })
  photos: string[];

  // Référence à l'utilisateur qui a créé la destination
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  // Référence à un ensemble d'utilisateurs assignés à la destination (rôle "guest")
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  assignedTo: Types.ObjectId[];
}

export const DestSchema = SchemaFactory.createForClass(Dest);
