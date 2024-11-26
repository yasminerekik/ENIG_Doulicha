import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { Response } from 'express';  // Pour typage de 'res'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() registerDto: RegisterDto) {
    return this.authService.signup(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const authResponse = await this.authService.login(loginDto);

      // Si la connexion est réussie, renvoyer l'utilisateur et le token JWT
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: {
          user: authResponse.user,        // Informations de l'utilisateur
          accessToken: authResponse.token, // Le token d'accès
        },
      });
    } catch (error) {
      // Gérer les erreurs de connexion
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
        error: error.message,  // Afficher le message d'erreur du serveur
      });
    }
  }
}
