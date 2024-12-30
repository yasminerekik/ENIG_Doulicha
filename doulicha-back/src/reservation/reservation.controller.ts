import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from '../dto/reservation.dto';
import { Reservation } from '../models/reservation.models';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Request() req,  // Access the request object to get the authenticated user
  ): Promise<Reservation> {
    const createdBy = req.user._id;  // Assuming the authenticated user is in req.user
    return this.reservationService.create(createReservationDto, createdBy);
  }


  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Reservation[]> {
    return this.reservationService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Reservation> {
    return this.reservationService.findReservationById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.reservationService.delete(id);
  }
}
