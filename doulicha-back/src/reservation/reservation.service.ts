import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reservation, ReservationDocument } from '../models/reservation.models';
import { CreateReservationDto } from '../dto/reservation.dto';
import { NotificationService } from 'src/notification/notification.service';
import { Dest } from 'src/models/dest.models';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
    @InjectModel(Dest.name) private destModel: Model<Dest>,
    private notificationService: NotificationService,
  ) {}

  async create(createReservationDto: CreateReservationDto, createdBy: Types.ObjectId): Promise<Reservation> {
    // Créez la réservation en ajoutant createdBy
    const newReservation = new this.reservationModel({
      ...createReservationDto,
      createdBy, // Associer la réservation à l'utilisateur qui l'a créée
    });

    await newReservation.save();

    // Récupérez la destination associée à la réservation
    const destination = await this.destModel.findById(createReservationDto.destinationId).exec();

    if (!destination) {
      throw new Error('Destination not found');
    }

    // Récupérez l'ownerId (createdBy) de la destination
    const ownerId = destination.createdBy.toString();

    // Préparez le message de notification
    const message = `New reservation for ${createReservationDto.fullname} from ${createReservationDto.startDate} to ${createReservationDto.endDate} for the place : ${destination.name}.`;
    const type = 'reservation'; // Type de notification

    // Créez la notification et envoyez-la à l'owner en incluant reservationId
    await this.notificationService.createNotification(ownerId, message, type, new Types.ObjectId(newReservation._id.toString()));

    // Retournez la réservation créée
    return newReservation;
  }


  async findAll(): Promise<Reservation[]> {
    return this.reservationModel.find().exec();
  }

  async findReservationById(id: string): Promise<Reservation | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId');
    }
    return this.reservationModel.findById(id).exec();
  }

  async delete(id: string): Promise<void> {
    const result = await this.reservationModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
  }
}
