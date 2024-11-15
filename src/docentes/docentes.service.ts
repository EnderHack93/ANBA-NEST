import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { randomInt } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Docente } from './entities/docente.entity';
import { Repository } from 'typeorm';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import * as bcryptjs from 'bcryptjs';
import { EstadoDocentes } from './entities/estado.enum';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { EstadoService } from 'src/estados/estado.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Estados } from 'src/estados/enum/estado.enum';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { EnumRoles } from 'src/common/enums/roles.enum';
import { EnumEstados } from 'src/common/enums/estados.enum';

@Injectable()
export class DocentesService {
  constructor(
    @InjectRepository(Docente)
    private readonly docenteRepository: Repository<Docente>,
    @InjectRepository(Especialidad)
    private readonly especialidadRepository: Repository<Especialidad>,
    private readonly estadoService: EstadoService,
    @Inject(forwardRef(()=>UsuariosService))
    private readonly userService: UsuariosService,
  ) {}
  async create(createDocenteDto: CreateDocenteDto) {
    try {

      await this.validateUniqueValues(createDocenteDto);

      const docenteDto = this.docenteRepository.create(createDocenteDto);
      
      const username = await this.genId(
        createDocenteDto.nombres,
        createDocenteDto.apellidos,
        createDocenteDto.carnet,
      );

      docenteDto.id_docente = username;

      const especialidad = await this.especialidadRepository.findOneBy({
        id_especialidad: createDocenteDto.id_especialidad,
      });

      if (!especialidad) {
        throw new BadRequestException('Especialidad no existe');
      }

      if (especialidad.estado.nombre == EnumEstados.INACTIVO) {
        throw new BadRequestException('Especialidad inactiva');
      }

      const docente = await this.docenteRepository.save({
        ...docenteDto,
        especialidad,
      });

      const userDto: CreateUsuarioDto = {
        username,
        email: createDocenteDto.correo,
        password: await bcryptjs.hash(createDocenteDto.password, 10),
        rol: EnumRoles.DOCENTE,
      };
      await this.userService.create(userDto);

      return docente;
    } catch (Ex) {
      throw new InternalServerErrorException(Ex);
    }
  }

  async changeState(id: string) {
    const docente = await this.docenteRepository.findOneBy({ id_docente: id });

    docente.estado =
      docente.estado === EstadoDocentes.ACTIVO
        ? EstadoDocentes.INACTIVO
        : EstadoDocentes.ACTIVO;

    return await this.docenteRepository.save(docente);
  }
  async findAll(query: PaginateQuery): Promise<Paginated<Docente>> {
    return paginate(query, this.docenteRepository, {
      relations: ['especialidad'],
      sortableColumns: ['id_docente', 'nombres', 'apellidos', 'carnet'],
      searchableColumns: [
        'id_docente',
        'nombres',
        'apellidos',
        'carnet',
        'especialidad.nombre',
      ],
      defaultSortBy: [['id_docente', 'ASC']],
      filterableColumns: {
        estado: [FilterOperator.EQ],
        'especialidad.nombre': [FilterOperator.ILIKE],
        nombres: [FilterOperator.ILIKE],
        apellidos: [FilterOperator.ILIKE],
        carnet: [FilterOperator.ILIKE],
        especialidad: [FilterOperator.ILIKE],
      },
    });
  }

  async findOne(id: string) {
    return await this.docenteRepository.findOneBy({ id_docente: id });
  }

  async findDocenteProfileInfo(id_docente: string) {
    const docenteRepository = this.docenteRepository;

    const docente = await this.docenteRepository.findOne({
      where: { id_docente},
      select:[
        'id_docente',
        'nombres',
        'apellidos',
        'carnet',
        'especialidad',
        'img_perfil',
        'estado'
      ]
    })

  if (!docente) {
    throw new NotFoundException('Docente no existe');
  }

  return docente;
  }

  async update(id: string, updateDocenteDto: UpdateDocenteDto) {
    const docente = await this.docenteRepository.findOneBy({ id_docente: id });
    if (!docente) {
      throw new BadRequestException('Docente no existe');
    }

    const especialidad = await this.especialidadRepository.findOneBy({
      id_especialidad: updateDocenteDto.id_especialidad,
    });

    if (!especialidad) {
      throw new BadRequestException('Especialidad no existe');
    }

    if (especialidad.estado.nombre == EnumEstados.INACTIVO) {
      throw new BadRequestException('Especialidad inactiva');
    }

    docente.especialidad = especialidad;
    delete updateDocenteDto.id_especialidad;
    Object.assign(docente, updateDocenteDto);
    return await this.docenteRepository.update(id, docente);
  }

  async remove(id: string) {
    const docente = await this.docenteRepository.findOneBy({ id_docente: id });

    docente.estado =
      docente.estado === EstadoDocentes.ACTIVO
        ? EstadoDocentes.INACTIVO
        : EstadoDocentes.ACTIVO;

    return await this.docenteRepository.save(docente);
  }

  async genId(nombres: string, apellidos: string, dni: string) {
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
  private async validateUniqueValues({ carnet, correo }: CreateDocenteDto) {
    const [docenteByCarnet, usuarioByEmail] = await Promise.all([
      this.docenteRepository.findOneBy({ carnet }),
      this.userService.findByEmail(correo),
    ]);

    if (docenteByCarnet) {
      throw new BadRequestException('El carnet ya está asociado a un docente');
    }

    if (usuarioByEmail) {
      throw new BadRequestException('El correo ya esta asociado a un usuario');
    }
  }
}
