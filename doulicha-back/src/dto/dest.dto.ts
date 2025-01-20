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

  
 
  readonly features?: string[];
  readonly cityName: string;
  

 
}
