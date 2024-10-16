import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs'
import { JwtService } from "@nestjs/jwt";
import { UsuariosService } from 'src/usuarios/usuarios.service';


@Injectable()
export class AuthService {
    constructor(
      private readonly usuariosService: UsuariosService,
      private readonly jwtService: JwtService
    ) {}
    async login({ correo, password }: LoginDto) {
        const user = await this.usuariosService.findByEmailwithPassword(correo);
    
        if (!user) {
          throw new UnauthorizedException("Invalid email");
        }
    
        const isPasswordValid = await bcryptjs.compare(password, user.password);
    
        if (!isPasswordValid) {
          throw new UnauthorizedException("Invalid password");
        }
    
        const payload = { email: user.email, rol:user.rol };

        const token = await this.jwtService.signAsync(payload);
    
        return {
          token: token,
          email: user.email,
        };
      }
}
