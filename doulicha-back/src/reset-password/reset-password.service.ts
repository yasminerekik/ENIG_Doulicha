import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { UserService } from '../users/users.service'; // Assurez-vous d'avoir un service utilisateur pour vérifier les e-mails
import * as dotenv from 'dotenv';
import { UserDocument } from 'src/models/users.models';
import * as bcrypt from 'bcrypt';
import { getResetPasswordTemplate } from './reset-password.template';
dotenv.config();
@Injectable()
export class ResetPasswordService {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(ResetPasswordService.name);


  async sendResetPasswordEmail(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('User not found'); // Vous pouvez personnaliser le message d'erreur
    }

    // Générer un token de réinitialisation (par exemple, un JWT ou un code aléatoire)
    const resetCode = Math.random().toString(36).substring(2, 10); // À remplacer par un vrai token
    user.resetToken = resetCode; // Sauvegarder le code dans la base de données
    await user.save();
    // Création du lien de réinitialisation
    const resetLink = `http://yourfrontend.com/reset-password?code=${resetCode}&email=${email}`;

    // Loguer les informations d'identification pour le débogage
    this.logger.log(`Using credentials - User: ${process.env.MAIL_USER}`);

    // Configuration de Nodemailer
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,     // Utilisation de la variable d'environnement
        pass: process.env.MAIL_PASS,     // Utilisation de la variable d'environnement
      },
      debug:'smtp',
    });
    this.logger.log(`MAIL_USER: ${process.env.MAIL_USER}`);
this.logger.log(`MAIL_PASS: ${process.env.MAIL_PASS}`);
     // Template d'e-mail HTML avec du style

    try {
      // Envoi de l'e-mail
      await transporter.sendMail({
        from: 'rekikyasmine28@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        html: getResetPasswordTemplate(resetCode, resetLink),
        text: `Voici votre code de réinitialisation: ${resetCode}.`,
      });

      this.logger.log(`Reset password email sent to: ${email}`);
    } catch (error) {
      this.logger.error('Error while sending email', error.stack);
      throw new Error('Error sending reset password email');
    }
  

    // Vous pouvez aussi enregistrer ce token dans la base de données si nécessaire
  }

  async verifyUserByEmail(email: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    return !!user; // Retourne true si l'utilisateur existe, sinon false
  }

  async verifyResetCode(email: string, code: string): Promise<UserDocument> {
    const user = await this.userService.findByEmail(email);
    if (!user || user.resetToken !== code) {
      throw new Error('Invalid or expired reset code');
    }
    return user;
  }

  async updatePassword(email: string, newPassword: string, code: string): Promise<void> {
    const user = await this.verifyResetCode(email, code);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null; // Supprimer le code après utilisation
    await user.save();
  }

}
