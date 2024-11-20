import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { EnumEstados } from 'src/common/enums/estados.enum';
import { RefreshTokenDto } from './dto/refresh.dto';
import { EstadoService } from 'src/estados/estado.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { EmailService } from 'src/email/email.service';
import { recoverPasswordDto } from './dto/recoverPass.dto';
import { ResetPasswordDto } from './dto/reset-password.fto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly estadoService: EstadoService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}
  async login({ correo, password, remember }: LoginDto) {
    const user = await this.usuariosService.findByEmailwithPassword(correo);

    if (!user) {
      throw new UnauthorizedException('Correo no existe en el sistema');
    }

    if (user.estado.nombre === EnumEstados.INACTIVO) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    if (user.estado.nombre === EnumEstados.BLOQUEADO) {
      throw new UnauthorizedException(
        'Usuario bloqueado, restaure su contraseña para acceder.',
      );
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 5) {
        await this.usuariosService.bloquearUsuario(user);
        throw new UnauthorizedException(
          'Usuario bloqueado, restaure su contraseña para acceder.',
        );
      }

      await this.usuariosService.updateLoginAttempts(
        user.id_usuario,
        user.failedLoginAttempts,
      );
      throw new UnauthorizedException(
        `Contraseña incorrecta quedan. ${5 - user.failedLoginAttempts} intentos.`,
      );
    }

    user.failedLoginAttempts = 0;

    await this.usuariosService.updateLoginAttempts(
      user.id_usuario,
      user.failedLoginAttempts,
    );

    const payload = { email: user.email, rol: user.rol, id: user.username };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
    });

    const expiresIn = remember ? '7d' : '1h';

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
  async refreshTokens(RefreshTokenDto: RefreshTokenDto) {
    try {
      const { refreshToken } = RefreshTokenDto;
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const user = await this.usuariosService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const newAccessToken = await this.jwtService.signAsync(
        {
          email: user.email,
          rol: user.rol,
          id: user.username,
        },
        {
          expiresIn: '10m',
        },
      );

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Refresh token no válido');
    }
  }
  async recoverPassword({ correo }: recoverPasswordDto) {
    try {
      const user = await this.usuariosService.findByEmail(correo);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      //if (user.estado.nombre === EnumEstados.BLOQUEADO) {
        // Genera un token para el enlace de recuperación
        const resetToken = await this.generateResetToken(user);

        // Enviar email (implementa el servicio para enviar correos)
        await this.emailService.sendRecoveryEmail(user.email, resetToken);

        return { message: 'Correo de recuperación enviado' };
      //}

    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async resetPassword(resetPasswordDto:ResetPasswordDto) {
    try {
      const { token, password } = resetPasswordDto;
      const { username } = this.jwtService.verify(token);
      const user = await this.usuariosService.findByUsername(username);

      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      // Cambiar la contraseña del usuario
      const newUser =await this.usuariosService.resetPassword(username, password);
      return { message: 'Contraseña actualizada' };
    } catch (error) {
      throw new BadRequestException('Token invalido intente nuevamente');
    }
  }

  async generateResetToken(user: Usuario) {
    const resetToken = this.jwtService.sign(
      { userId: user.id_usuario },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' }, // Expira en 15 minutos
    );
    return resetToken;
  }
}
