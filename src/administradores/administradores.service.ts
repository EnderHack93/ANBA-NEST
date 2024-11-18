import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdministradorDto } from './dto/create-administrador.dto';
import { UpdateAdministradoreDto } from './dto/update-administrador.dto';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { query } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { Administrador } from './entities/administrador.entity';
import { randomInt } from 'crypto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { EstadoService } from 'src/estados/estado.service';
import { EnumEstados } from 'src/common/enums/estados.enum';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { EnumRoles } from 'src/common/enums/roles.enum';

@Injectable()
export class AdministradoresService {
  constructor(
    @InjectRepository(Administrador)
    private readonly administradorRepository: Repository<Administrador>,
    @Inject(forwardRef(() => UsuariosService))
    private readonly userService: UsuariosService,
    @Inject()
    private readonly estadoService: EstadoService,
  ) {}
  async create(createAdministradorDto: CreateAdministradorDto) {
    try {
      await this.validateUniqueValues(createAdministradorDto);
      const administradorDto = this.administradorRepository.create(
        createAdministradorDto,
      );
      const username = await this.genId(
        createAdministradorDto.nombres,
        createAdministradorDto.apellidos,
        createAdministradorDto.carnet,
      );
      administradorDto.id_admin = username;

      const estado = await this.estadoService.findByName(EnumEstados.ACTIVO);

      const administrador = await this.administradorRepository.save({
        ...administradorDto,
        estado,
      });
      //const password = await this.genPassword();
      const password = 'password';
      const userDto: CreateUsuarioDto = {
        username,
        email: createAdministradorDto.correo,
        password: await bcryptjs.hash(password, 10),
        rol: EnumRoles.ADMIN,
      };
      await this.userService.create(userDto);
      return administrador;
    } catch (Ex) {
      throw new InternalServerErrorException('Error al crear administrador');
    }
  }

  findAll(query: PaginateQuery): Promise<Paginated<Administrador>> {
    return paginate(query, this.administradorRepository, {
      sortableColumns: ['id_admin', 'nombres', 'apellidos', 'carnet'],
      searchableColumns: ['id_admin', 'apellidos', 'nombres', 'carnet'],
      defaultSortBy: [['id_admin', 'ASC']],
      filterableColumns: {},
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} administradore`;
  }

  async findAdminProfileInfo(id_admin: string) {

    const docente = await this.administradorRepository.findOne({
      where: { id_admin},
      select:[
        'id_admin',
        'nombres',
        'apellidos',
        'carnet',
        'img_perfil',
        'estado'
      ]
    })

  if (!docente) {
    throw new NotFoundException('Docente no existe');
  }

  return docente;
  }

  update(id: number, updateAdministradoreDto: UpdateAdministradoreDto) {
    return `This action updates a #${id} administradore`;
  }

  remove(id: number) {
    return `This action removes a #${id} administradore`;
  }

  private async genId(nombres: string, apellidos: string, dni: string) {
    const primeraLetraNombres = nombres.charAt(0).toUpperCase();
    const primeraLetraApellidos = apellidos.charAt(0).toLocaleUpperCase();

    const primerDigitoDni = dni.charAt(0);
    const ultimoDigitoDni = dni.charAt(dni.length - 1);

    const numerosAleatorios = Array.from({ length: 4 }, () =>
      randomInt(0, 10),
    ).join('');

    const id = `${primeraLetraNombres}${primeraLetraApellidos}${primerDigitoDni}${ultimoDigitoDni}${numerosAleatorios}`;

    return id;
  }

  private async validateUniqueValues({
    carnet,
    correo,
  }: CreateAdministradorDto) {
    const [docenteByCarnet, usuarioByEmail] = await Promise.all([
      this.administradorRepository.findOneBy({ carnet }),
      this.userService.findByEmail(correo),
    ]);

    if (docenteByCarnet) {
      throw new BadRequestException('El carnet ya está asociado a un docente');
    }

    if (usuarioByEmail) {
      throw new BadRequestException('El correo ya esta asociado a un usuario');
    }
  }
  private async genPassword() {
    const length = 12
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = "!@#$%^&*()_+-=[]{}|;:',.<>?/";

    // Combinar todos los conjuntos de caracteres
    const allCharacters = uppercase + lowercase + numbers + specialCharacters;

    let password = '';

    // Asegurarse de incluir al menos un carácter de cada tipo
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password +=
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

    // Rellenar el resto de la contraseña con caracteres aleatorios
    for (let i = password.length; i < length; i++) {
      password +=
        allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }

    // Mezclar los caracteres para evitar patrones predecibles
    password = password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');


    return password;
  }
}
