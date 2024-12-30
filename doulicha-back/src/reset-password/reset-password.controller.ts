import { Controller, Post, Body, UseGuards, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('reset-password')
export class ResetPasswordController {
  private readonly logger = new Logger(ResetPasswordController.name);

  constructor(private readonly resetPasswordService: ResetPasswordService) {}
  
  @Post()
  async resetPassword(@Body('email') email: string): Promise<{ message: string }> {
    try {
      // Vérification si l'email existe dans la base de données
      const userExists = await this.resetPasswordService.verifyUserByEmail(email);
      if (!userExists) {
        throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
      }

      // Envoi de l'email de réinitialisation
      await this.resetPasswordService.sendResetPasswordEmail(email);
      
      // Réponse structurée avec succès
      return { message: 'Reset password email sent successfully' };
    } catch (error) {
      this.logger.error('Error while resetting password', error.stack);

      // Gestion des erreurs avec des exceptions spécifiques
      if (error instanceof HttpException) {
        throw error; // Rejette l'exception spécifique HTTP
      } else {
        throw new HttpException(
          'An error occurred while sending reset password email',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  
  @Post('verify-email')
  async verifyEmail(@Body('email') email: string): Promise<{ message: string }> {
    try {
      const userExists = await this.resetPasswordService.verifyUserByEmail(email);
      
      if (!userExists) {
        throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
      }

      return { message: 'User exists, you can proceed with the password reset' };
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
