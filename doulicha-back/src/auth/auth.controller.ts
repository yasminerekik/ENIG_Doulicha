import { Controller, Post, Body, Res, HttpStatus, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { Response } from 'express';  // Pour typage de 'res'
import { ResetPasswordService } from 'src/reset-password/reset-password.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
  private readonly resetPasswordService: ResetPasswordService ){}


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

  // Demander un code de réinitialisation
  @Post('reset-password')
  async requestResetPassword(@Body('email') email: string): Promise<void> {
    await this.resetPasswordService.sendResetPasswordEmail(email);
  }

  // Vérifier le code et mettre à jour le mot de passe
  @Put('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
    @Body('code') code: string,
  ): Promise<void> {
    await this.resetPasswordService.updatePassword(email, newPassword, code);
  }
}
