import { Controller, Get, Post, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReservationService } from 'src/reservation/reservation.service';
import { DestService } from 'src/dest/dest.service';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly reservationService: ReservationService,
    private readonly destService: DestService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('comment')
  async addCommentToReservation(
    @Body('comment') comment: string,
    @Body('reservationId') reservationId: string,
  ) {
    // Find the reservation
    const reservation = await this.reservationService.findReservationById(reservationId);
    
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    const destination = await this.destService.findOne(reservation.destinationId);
    
    if (!destination) {
      throw new Error('destination not found');
    }

    // Prepare a message for the new notification
    const message = `New comment: "${comment}" on your reservation for ${destination.name} by ${reservation.fullname}`;

    // Send notification to the creator of the reservation
    await this.notificationService.createNotification(reservation.createdBy.toString(), message, 'comment');

    return { message: 'Comment and notification sent' };
  }

  // Route pour récupérer les notifications par ownerId
  @UseGuards(JwtAuthGuard)
  @Get(':ownerId')
  async getNotifications(@Param('ownerId') ownerId: string) {
    return this.notificationService.getNotificationsByOwner(ownerId);
  }

  // Route pour créer une notification
  @UseGuards(JwtAuthGuard)
  @Post()
  async createNotification(
    @Body() { ownerId, message, type }: { ownerId: string; message: string; type: string },
  ) {
    return this.notificationService.createNotification(ownerId, message, type);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/done')
  async markAsDone(@Param('id') notificationId: string) {
    return this.notificationService.updateNotificationState(notificationId, 'done');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':ownerId/:etat')
  async getFilteredNotifications(
    @Param('ownerId') ownerId: string,
    @Param('etat') etat: 'done' | 'not yet' | 'all',
  ) {
    return this.notificationService.getFilteredNotifications(ownerId, etat);
  }
}


