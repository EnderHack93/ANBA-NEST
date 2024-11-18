import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';
import * as bcryptjs from 'bcryptjs';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import { EstadoEst } from './entities/estado.enum';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Inscrito } from 'src/inscritos/entities/inscrito.entity';
import { EstadoService } from 'src/estados/estado.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { EnumEstados } from 'src/common/enums/estados.enum';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { EnumRoles } from 'src/common/enums/roles.enum';
import { MateriasService } from 'src/materias/materias.service';

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Especialidad)
    private readonly especialidadRepository: Repository<Especialidad>,
    @InjectRepository(Inscrito)
    private readonly inscritoRepository: Repository<Inscrito>,
    private readonly estadoService: EstadoService,
    @Inject(forwardRef(() => UsuariosService))
    private readonly userService: UsuariosService,
    private readonly materiaService:MateriasService,
  ) {}
  async create(createEstudianteDto: CreateEstudianteDto) {
    try {
      await this.validateUniqueValues(createEstudianteDto);
      const estudianteDto =
        this.estudianteRepository.create(createEstudianteDto);
      const username = await this.genId(
        estudianteDto.nombres,
        estudianteDto.apellidos,
        estudianteDto.carnet,
      );

      estudianteDto.id_estudiante = username;

      const especialidad = await this.especialidadRepository.findOneBy({
        id_especialidad: createEstudianteDto.id_especialidad,
      });
      if (!especialidad) {
        throw new BadRequestException('Especialidad no existe');
      }

      if (especialidad.estado.nombre == EnumEstados.INACTIVO) {
        throw new BadRequestException('Especialidad inactiva');
      }

      const estudiante = await this.estudianteRepository.save({
        ...estudianteDto,
        especialidad,
      });
      const userDto: CreateUsuarioDto = {
        username,
        email: createEstudianteDto.correo,
        password: await bcryptjs.hash(createEstudianteDto.password, 10),
        rol: EnumRoles.ESTUDIANTE,
      };

      await this.userService.create(userDto);

      return estudiante;
    } catch (Ex) {
      throw new InternalServerErrorException(Ex);
    }
  }
  async findEstudianteProfileInfo(id_estudiante: string) {
    const docente = await this.estudianteRepository.findOne({
      where: { id_estudiante},
      select:[
        'id_estudiante',
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

  async getEstudiantesPorMateria(id_materia: number) {
    const materia = await this.materiaService.findOne(id_materia);
  
    if (!materia) {
      throw new Error('Materia no encontrada');
    }
  
    // Obtener todos los estudiantes que NO están inscritos en clases de la materia
    const estudiantes = await this.estudianteRepository
      .createQueryBuilder('estudiante')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('inscripcion.id_estudiante')
          .from('inscrito', 'inscripcion')
          .leftJoin('inscripcion.clase', 'clase')
          .where('clase.id_materia = :id_materia')
          .getQuery();
        return 'estudiante.id_estudiante NOT IN ' + subQuery;
      })
      .setParameter('id_materia', id_materia)
      .select([
        'estudiante.id_estudiante',
        'estudiante.nombres',
        'estudiante.carnet',
      ])
      .getMany();
  
    return estudiantes;
  }
  

  async findAll(query: PaginateQuery): Promise<Paginated<Estudiante>> {
    return paginate(query, this.estudianteRepository, {
      relations: ['especialidad'],
      sortableColumns: ['id_estudiante', 'nombres', 'apellidos', 'carnet'],
      searchableColumns: ['id_estudiante', 'nombres', 'apellidos', 'carnet'],
      defaultSortBy: [['id_estudiante', 'ASC']],
      filterableColumns: {
        estado: [FilterOperator.EQ, FilterSuffix.NOT],
        'especialidad.nombre': [FilterOperator.EQ],
        nombres: [FilterOperator.ILIKE],
        apellidos: [FilterOperator.ILIKE],
        carnet: [FilterOperator.ILIKE],
        especialidad: [FilterOperator.ILIKE],
      },
    });
  }

  async findOne(id: string) {
    return await this.estudianteRepository.findOneBy({ id_estudiante: id });
  }

  async update(id: string, updateEstudianteDto: UpdateEstudianteDto) {
    const estudiante = await this.estudianteRepository.findOneBy({
      id_estudiante: id,
    });

    if (!estudiante) {
      throw new BadRequestException('Estudiante no existe');
    }

    const especialidad = await this.especialidadRepository.findOneBy({
      id_especialidad: updateEstudianteDto.id_especialidad,
    });

    if (!especialidad) {
      throw new BadRequestException('Especialidad no existe');
    }

    // if (especialidad.estado == EstadoEspecialidad.INACTIVO) {
    //   throw new BadRequestException('Especialidad inactiva');
    // }

    estudiante.especialidad = especialidad;
    delete updateEstudianteDto.id_especialidad;
    Object.assign(estudiante, updateEstudianteDto);
    return await this.estudianteRepository.update(id, estudiante);
  }

  async remove(id: string) {
    return await this.estudianteRepository.softDelete({ id_estudiante: id });
  }
  async changeState(id: string) {
    const estudiante = await this.estudianteRepository.findOneBy({
      id_estudiante: id,
    });

    estudiante.estado =
      estudiante.estado === EstadoEst.ACTIVO
        ? EstadoEst.INACTIVO
        : EstadoEst.ACTIVO;

    return await this.estudianteRepository.save(estudiante);
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
  private async validateUniqueValues({ carnet, correo }: CreateEstudianteDto) {
    const [docenteByCarnet, usuarioByEmail] = await Promise.all([
      this.estudianteRepository.findOneBy({ carnet }),
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
