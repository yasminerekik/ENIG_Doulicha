import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Types ajouté pour ObjectId
import { Dest, DestDocument } from '../models/dest.models';
import { DestDto } from '../dto/dest.dto';
import { UpdateDestDto } from '../dto/update-dest.dto';
import { UserService } from 'src/users/users.service';
import { UserRole} from 'src/dto/register.dto';
import { UserDocument } from 'src/models/users.models';
import { CreateDestDto } from 'src/dto/create-dest.dto';

@Injectable()
export class DestService {
  constructor(
    @InjectModel(Dest.name) private readonly destModel: Model<DestDocument>,
    private readonly userService: UserService, // Injectez UserService ici
  ) {}

  async create(destDto: CreateDestDto, ownerId: string): Promise<Dest> {
    // Convertir les champs assignedTo et createdBy en ObjectId
    const photos = Array.isArray(destDto.photos) ? destDto.photos : [];
    const assignedTo = Array.isArray(destDto.assignedTo) ? destDto.assignedTo : [];

    // Récupérer les utilisateurs ayant le rôle 'guest'
    const guests: UserDocument[] = await this.userService.findByRole(UserRole.GUEST); // Typage correct ici

    // Extraire les ObjectId des utilisateurs ayant le rôle 'guest'
    const guestIds = guests.map(user => user._id); // _id est disponible ici

    // Créer la destination
    const newDest = new this.destModel({
      name: destDto.name,
      description: destDto.description,
      address: destDto.address,
      photos: photos,
      createdBy: new Types.ObjectId(ownerId),
      assignedTo: guestIds, // Affecter les utilisateurs ayant le rôle 'guest'
    });

    return newDest.save();
  }
  // Récupérer toutes les destinations
  async findAll(): Promise<Dest[]> {
    // Vous pouvez aussi ajouter populate pour createdBy et assignedTo
    return this.destModel.find().populate('createdBy').populate('assignedTo').exec();
  }

  // Récupérer une destination par ID
  async findOne(id: string): Promise<Dest> {
    const dest = await this.destModel.findById(id).populate('createdBy').populate('assignedTo').exec();
    if (!dest) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }
    return dest;
  }

  // Mettre à jour une destination
  async update(id: string, updateDestDto: UpdateDestDto): Promise<Dest> {
    const updatedFields = {
      ...updateDestDto,
      assignedTo: updateDestDto.assignedTo?.map(userId => new Types.ObjectId(userId)), // Convertir les utilisateurs assignés en ObjectId
    };

    const existingDest = await this.destModel.findByIdAndUpdate(id, updatedFields, { new: true }).exec();
    if (!existingDest) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }
    return existingDest;
  }

  // Supprimer une destination
  async remove(id: string): Promise<Dest> {
    const deletedDest = await this.destModel.findByIdAndDelete(id).exec();
    if (!deletedDest) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }
    return deletedDest;
  }
}
