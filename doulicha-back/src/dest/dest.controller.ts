import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  BadRequestException,
  UnauthorizedException,
  UseInterceptors,
  UploadedFiles,
  InternalServerErrorException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DestService } from './dest.service';
import { DestDto } from '../dto/dest.dto';
import { UpdateDestDto } from '../dto/update-dest.dto';
import { Dest } from '../models/dest.models';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRole } from 'src/dto/register.dto';
import * as path from 'path';
import { CreateDestDto } from 'src/dto/create-dest.dto';

// Fonction utilitaire pour générer un nom de fichier unique
function generateFileName(originalname: string): string {
  const ext = originalname.split('.').pop();
  const timestamp = Date.now();
  return `${timestamp}.${ext}`;
}

@Controller('dests')
export class DestController {
  constructor(private readonly destService: DestService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(

    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileName = generateFileName(file.originalname); // Utilisation de la fonction pour générer un nom unique
          cb(null, fileName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
      },
    }),
  )
  async create(
    @UploadedFiles() photos: Express.Multer.File[],
    @Body() destDto: DestDto,
    @Request() req,
  ): Promise<Dest> {
    // Ajout des logs avant le traitement pour vérifier les données
    console.log('Destination DTO:', destDto);
    console.log('Photos:', photos);

    // Vérification des permissions de l'utilisateur
    if (req.user.role !== UserRole.OWNER) {
      throw new UnauthorizedException(
        'Vous n\'avez pas l\'autorisation pour effectuer cette action',
      );
    }
    const photoUrls = photos.map((file) => `http://localhost:5000/uploads/${file.filename}`);
    let newdto:CreateDestDto = {address:destDto.address,description:destDto.description,name:destDto.name,photos:photoUrls,features:destDto.features || [], cityName: destDto.cityName }  // Ajout des features };

  
    

    try {
      const ownerId = req.user._id;
      console.log('Received files:', photos); // Log des fichiers reçus
      return this.destService.create(newdto, ownerId);
    } catch (error) {
      console.error('Error during file processing:', error);
      throw new InternalServerErrorException('Erreur serveur lors du traitement des fichiers');
    }
  }

  @Get()
  async findAll(): Promise<Dest[]> {
    return this.destService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Dest> {
    return this.destService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
@Put(':id')
@UseInterceptors(
  FilesInterceptor('photos', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const fileName = generateFileName(file.originalname);
        cb(null, fileName);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
  }),
)
async update(
  @Param('id') id: string,
  @UploadedFiles() photos: Express.Multer.File[],
  @Body() destDto: DestDto,
  @Request() req,
): Promise<Dest> {
  if (req.user.role !== UserRole.OWNER) {
    throw new UnauthorizedException('Vous n\'avez pas l\'autorisation pour effectuer cette action');
  }

  const photoUrls = photos.length > 0 ? photos.map(file => `http://localhost:5000/uploads/${file.filename}`) : [];
  let newdto:CreateDestDto = {address:destDto.address,description:destDto.description,name:destDto.name,photos:photoUrls, cityName:destDto.cityName };


  try {
    return this.destService.update(id, destDto, photoUrls);
  } catch (error) {
    console.error('Error during file processing:', error);
    throw new InternalServerErrorException('Erreur serveur lors du traitement des fichiers');
  }
}


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<Dest> {
    if (req.user.role !== UserRole.OWNER) {
      throw new UnauthorizedException(
        'Vous n\'avez pas l\'autorisation pour effectuer cette action',
      );
    }
    return this.destService.remove(id);
  }


  @Get('city/:cityName')
async getDestinationsByCity(@Param('cityName') cityName: string): Promise<Dest[]> {
  return this.destService.findDestinationsByCity(cityName);
}


}
