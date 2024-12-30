import { IsString, IsNotEmpty, IsEmail, IsNumber, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsNumber()
  @IsNotEmpty()
  numberOfPersons: number;

  @IsString()
  @IsNotEmpty()
  destinationId: string;
}
