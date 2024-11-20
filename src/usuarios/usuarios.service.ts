import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoService } from 'src/estados/estado.service';
import { EnumEstados } from 'src/common/enums/estados.enum';
import { DocentesService } from 'src/docentes/docentes.service';
import * as bcryptjs from 'bcryptjs';
import { EmailController } from 'src/email/email.controller';
import { EnumRoles } from 'src/common/enums/roles.enum';
import { EstudiantesService } from 'src/estudiantes/estudiantes.service';
import { AdministradoresService } from 'src/administradores/administradores.service';
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    private readonly estadoService: EstadoService,
    @Inject(forwardRef(() => DocentesService))
    private readonly docentesService: DocentesService,
    @Inject(forwardRef(() => EstudiantesService))
    private readonly estudiantesService: EstudiantesService,
    @Inject(forwardRef(() => AdministradoresService))
    private readonly administradoresService: AdministradoresService,
  ) {}
  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const estadoActivo = await this.estadoService.findByName(
        EnumEstados.ACTIVO,
      );
      const user = this.usuariosRepository.create({
        ...createUsuarioDto,
        estado: estadoActivo,
      });

      return await this.usuariosRepository.save(user);
    } catch (Ex) {
      throw new BadRequestException('Error al crear usuario');
    }
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  async findByEmail(email: string) {
    const user = await this.usuariosRepository.findOneBy({
      email,
    });

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.usuariosRepository.findOneBy({
      username,
    });

    return user;
  }

  async getProfileInfo(id: string, rol: EnumRoles) {
    let profileInfo;
  
    // Buscar la información según el rol
    switch (rol) {
      case EnumRoles.DOCENTE:
        profileInfo = await this.docentesService.findDocenteProfileInfo(id);
        break;
  
      case EnumRoles.ESTUDIANTE:
        profileInfo = await this.estudiantesService.findEstudianteProfileInfo(id);
        break;
  
      case EnumRoles.ADMIN:
        profileInfo = await this.administradoresService.findAdminProfileInfo(id);
        break;
  
      default:
        throw new Error(`Rol no reconocido: ${rol}`);
    }
  
    // Buscar la información del usuario
    const usuario = await this.usuariosRepository.findOne({
      where: {
        username: id,
      },
      select: ['id_usuario', 'username', 'email', 'rol'],
    });
  
    // Asociar la información del usuario al perfil
    profileInfo.usuario = usuario;
    const result = {
      info: profileInfo,
      usuario
    }
  
    return result;
  }
  

  async findByEmailwithPassword(email: string) {
    const user = await this.usuariosRepository.findOne({
      where: {
        email,
      },
      select: [
        'id_usuario',
        'username',
        'email',
        'password',
        'rol',
        'failedLoginAttempts',
      ],
    });
    return user;
  }

  async updateLoginAttempts(id_usuario: number, attempts: number) {
    try {
      const user = await this.usuariosRepository.findOneBy({
        id_usuario,
      });

      user.failedLoginAttempts = attempts;
      await this.usuariosRepository.save(user);
      return user;
    } catch (Ex) {
      console.log(Ex);
    }
  }

  async bloquearUsuario(user: Usuario) {
    try {
      const estado = await this.estadoService.findByName(EnumEstados.BLOQUEADO);
      user.estado = estado;
      await this.usuariosRepository.save(user);
      return user;
    } catch (Ex) {
      console.log(Ex);
    }
  }

  async resetPassword(username: string, password: string) {
    try {
      const user = await this.usuariosRepository.findOneBy({ username });
      user.password = await bcryptjs.hash(password, 10);
      const estado = await this.estadoService.findByName(EnumEstados.ACTIVO);
      user.estado = estado;
      user.failedLoginAttempts = 0;
      await this.usuariosRepository.save(user);
      return user;
    } catch (Ex) {
      throw new BadRequestException('Error al cambiar la contraseña');
    }
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
