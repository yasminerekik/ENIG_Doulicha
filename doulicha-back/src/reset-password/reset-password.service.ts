import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { UserService } from '../users/users.service'; // Assurez-vous d'avoir un service utilisateur pour vérifier les e-mails
import * as dotenv from 'dotenv';
import { debug } from 'console';
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
    const resetToken = Math.random().toString(36).substring(2, 15); // À remplacer par un vrai token

    // Création du lien de réinitialisation
    const resetPasswordLink = `http://yourfrontend.com/reset-password?token=${resetToken}`;

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


    try {
      // Envoi de l'e-mail
      await transporter.sendMail({
        from: 'rekikyasmine28@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        html: 
        `<p>Bonjour,</p>
        <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
        <a href="${resetPasswordLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Réinitialiser le mot de passe</a>
        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
        <p>Merci,</p>
        <p>L'équipe de votre site</p>
      `,
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

}
