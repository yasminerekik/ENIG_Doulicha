import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../models/users.models';
import { RegisterDto, UserRole } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';  // Importer JwtService

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,  // Injecter JwtService
  ) {}

  async signup(registerDto: RegisterDto): Promise<User> {
    const { firstname, lastname, email, password, role } = registerDto;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new this.userModel({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
    });

    return newUser.save();
  }

  async login(loginDto: LoginDto): Promise<any> {  // Retourner un objet avec le token
    const { email, password } = loginDto;

    // Vérifier si l'utilisateur existe
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Comparer le mot de passe
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Générer un token JWT
    const payload = { email: user.email, _id: user._id, role: user.role };  // Payload pour le token
    const token = this.jwtService.sign(payload, {secret: process.env.JWT_SECRET,});  // Générer le token avec JwtService

    return {
      user: {
        _id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
      token,  // Ajouter le token dans la réponse
    };
  }
}
