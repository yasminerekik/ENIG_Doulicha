import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DestDocument = Dest & Document;

@Schema()
export class Dest {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  photos: string[];

 // Assurez-vous que la propriété 'city' est bien décorée
  // Référence à l'utilisateur qui a créé la destination
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  // Référence à un ensemble d'utilisateurs assignés à la destination (rôle "guest")
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  assignedTo: Types.ObjectId[];

   // Nouvelle propriété pour les fonctionnalités
  @Prop({ type: [String], default: [] }) 
  features: string[];  // Ajout de la colonne features

  @Prop({ type: String, required: true  })
  cityName: string;  // Référence à l'ID de la ville


}

export const DestSchema = SchemaFactory.createForClass(Dest);
