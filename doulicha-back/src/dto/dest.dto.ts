import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayMinSize } from 'class-validator';
import { Types } from 'mongoose';

export class DestDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1) // Au moins une photo
  photos: string[];

  // Liste des utilisateurs assignés (avec rôle "guest")
  @IsArray()
  @ArrayNotEmpty()
  readonly assignedTo: Types.ObjectId[]; // Utilisateurs assignés
}
