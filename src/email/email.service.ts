import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRecoveryEmail(email: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
    console.log(resetUrl);
    try {
      await this.mailerService.sendMail({
        to: email,
        from: '"ANBA Académica" <anba.academica@gmail.com>',
        subject: 'Recuperación de contraseña',
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                margin: 0;
                padding: 0;
                color: #2C3E91;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                background-color: #4169E1;
                color: #ffffff;
                padding: 20px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .body {
                padding: 20px;
              }
              .body p {
                line-height: 1.6;
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                background-color: #50C878;
                color: #ffffff !important;
                text-decoration: none;
                padding: 10px 20px;
                font-size: 16px;
                font-weight: bold;
                border-radius: 5px;
                margin-top: 10px;
              }
              .button:hover {
                background-color: #3CA165;
              }
              .footer {
                background-color: #f4f4f9;
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #7d7d7d;
              }
              .footer a {
                color: #4169E1;
                text-decoration: none;
              }
              .footer a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>ANBA Académica</h1>
              </div>
              <div class="body">
                <p>Hola,</p>
                <p>Hemos recibido una solicitud para recuperar tu contraseña. Por favor, haz clic en el botón a continuación para restablecerla:</p>
                <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
                <p>Si no solicitaste este cambio, por favor ignora este correo. Tu cuenta permanecerá segura.</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 ANBA Académica. Todos los derechos reservados.</p>
                <p><a href="https://www.anbaacademica.com">Visita nuestro sitio web</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    } catch (e) {
      throw new BadRequestException('Error al enviar correo electrónico');
    }
  }
}
