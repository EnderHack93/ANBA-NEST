import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { EnumEstados } from 'src/common/enums/estados.enum';
import { RefreshTokenDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}
  async login({ correo, password,remember }: LoginDto) {
    const user = await this.usuariosService.findByEmailwithPassword(correo);

    if (!user) {
      throw new UnauthorizedException('Correo no existe en el sistema');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña Incorrecta');
    }

    if (user.estado.nombre === EnumEstados.INACTIVO) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const payload = { email: user.email, rol: user.rol , id:user.username};

    const accessToken = await this.jwtService.signAsync(payload,{
      expiresIn: '1m',
    })

    const expiresIn = remember ? '7d' : '1m'

    const refreshToken = await this.jwtService.signAsync(payload,{
      expiresIn,
    })

    return {
      accessToken,
      refreshToken
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

      const newAccessToken = await this.jwtService.signAsync({
        email: user.email,
        rol: user.rol,
        id: user.username,
      }, {
        expiresIn: '1m',
      });

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Refresh token no válido');
    }
  }
}
