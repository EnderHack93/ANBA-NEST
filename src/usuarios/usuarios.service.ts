import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoService } from 'src/estados/estado.service';
import { EnumEstados } from 'src/common/enums/estados.enum';
import { DocentesService } from 'src/docentes/docentes.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    private readonly estadoService: EstadoService,
    @Inject(forwardRef(() => DocentesService))
    private readonly docentesService:DocentesService
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

  async getProfileInfo(id:string){
    const docente = await this.docentesService.findDocenteProfileInfo(id)
    const usuario = await this.usuariosRepository.findOne({
      where: {
        username: id,
      },
      select: ['id_usuario', 'username', 'email', 'rol'],
    })
    docente.usuario = usuario
    return docente;
  }

  async findByEmailwithPassword(email: string) {
    const user = await this.usuariosRepository.findOne({
      where: {
        email,
      },
      select: ['id_usuario', 'username', 'email', 'password', 'rol'],
    });
    return user;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
