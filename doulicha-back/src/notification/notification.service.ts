import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from '../models/notification.models';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  // Enregistrer une notification
  async createNotification(ownerId: string, message: string, type: string, reservationId?: Types.ObjectId ): Promise<Notification> {
    const newNotification = new this.notificationModel({
      ownerId,
      message,
      type,
      createdAt: new Date(),
      reservationId: reservationId ? new Types.ObjectId(reservationId) : undefined,
    });
    return newNotification.save();
  }

  // Récupérer les notifications par ownerId
  async getNotificationsByOwner(ownerId: string): Promise<Notification[]> {
    return this.notificationModel.find({ ownerId }).sort({ createdAt: -1 }).exec();
  }

  async updateNotificationState(notificationId: string, newState: 'done' | 'not yet'): Promise<Notification> {
    const notification = await this.notificationModel.findById(notificationId);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.etat = newState;
    return notification.save(); // Save and return the updated notification
  }

  async getFilteredNotifications(ownerId: string, etat: 'done' | 'not yet' | 'all'): Promise<Notification[]> {
    const query = { ownerId };

    if (etat !== 'all') {
      query['etat'] = etat;
    }

    return this.notificationModel.find(query).exec();
  }

  async delete(id: string): Promise<void> {
    const result = await this.notificationModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
  }
  
}
