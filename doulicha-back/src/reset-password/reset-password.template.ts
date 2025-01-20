export const getResetPasswordTemplate = (resetCode: string, resetLink: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 0;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- En-tête -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center; background-color: #4F46E5; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Réinitialisation de votre mot de passe</h1>
                        </td>
                    </tr>
                    
                    <!-- Contenu principal -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">Bonjour,</p>
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte. Voici votre code de réinitialisation :</p>
                            
                            <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; text-align: center; margin: 30px 0;">
                                <span style="font-family: monospace; font-size: 24px; font-weight: bold; color: #4F46E5; letter-spacing: 3px;">${resetCode}</span>
                            </div>
                            <p style="margin: 0 0 20px; color: #666666; font-size: 14px;">Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>
                            
                            <p style="margin: 0 0 20px; color: #666666; font-size: 14px;">Ce lien expirera dans 24 heures pour des raisons de sécurité.</p>
                        </td>
                    </tr>
                    
                    <!-- Pied de page -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; color: #666666; font-size: 14px;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;