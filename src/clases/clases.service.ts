import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClaseDto } from './dto/create-clase.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Clase } from './entities/clase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materia } from 'src/materias/entities/materia.entity';
import { Docente } from 'src/docentes/entities/docente.entity';
import { EstadoMateria } from 'src/materias/entities/estado.enum';
import { EstadoDocentes } from 'src/docentes/entities/estado.enum';
import { EnumEstados } from 'src/common/enums/estados.enum';
import { EstadoService } from 'src/estados/estado.service';
import { EnumHorarios } from 'src/common/enums/horarios.enum';

@Injectable()
export class ClasesService {
  constructor(
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>,
    @InjectRepository(Docente)
    private readonly docenteRepository: Repository<Docente>,
    private readonly estadoService: EstadoService,
  ) {}
  async create(createClaseDto: CreateClaseDto) {
    const [horaInicio, horaFin] = this.descomponerHorario(
      createClaseDto.horario,
    );

    const estado = await this.estadoService.findByName(EnumEstados.ACTIVO);

    const clase = this.claseRepository.create({
      ...createClaseDto,
      horaInicio,
      horaFin,
      estado,
    });
    const materia = await this.materiaRepository.findOneBy({
      id_materia: createClaseDto.id_materia,
    });

    if (!materia) {
      throw new BadRequestException('Materia no encontrada');
    }

    if (materia.estado.nombre == EnumEstados.INACTIVO) {
      throw new BadRequestException('Materia inactiva');
    }

    const docente = await this.docenteRepository.findOneBy({
      id_docente: createClaseDto.id_docente,
    });

    if (!docente) {
      throw new BadRequestException('Docente no encontrado');
    }

    if (docente.estado.nombre == EnumEstados.INACTIVO) {
      throw new BadRequestException('Docente inactivo');
    }

    return await this.claseRepository.save({
      ...clase,
      materia,
      docente,
    });
  }

  private descomponerHorario(horario: EnumHorarios): [string, string] {
    const regex = /^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/;
    const match = horario.match(regex);

    if (!match) {
      return [null, null];
    }

    const horaInicio = match[1];
    const horaFin = match[2];

    return [horaInicio, horaFin];
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Clase>> {
    return await paginate(query, this.claseRepository, {
      relations: [
        'materia',
        'docente',
        'materia.especialidad',
        'materia.semestre',
        'estado',
      ],
      sortableColumns: ['id_clase', 'nombre'],
      searchableColumns: ['id_clase', 'nombre'],
      defaultSortBy: [['id_clase', 'ASC']],
      filterableColumns: {
        estado: [FilterOperator.EQ],
        nombre: [FilterOperator.ILIKE],
        semestre: [FilterOperator.ILIKE],
        docente: [FilterOperator.ILIKE],
        'materia.especialidad.nombre': [FilterOperator.ILIKE],
      },
    });
  }

  async getRendimientoGeneral() {
    const rendimiento = await this.claseRepository
      .createQueryBuilder('clase')
      .select('docente.nombres', 'docente')
      .leftJoin('clase.evaluaciones', 'evaluaciones')
      .leftJoin('clase.docente', 'docente')
      .addSelect('AVG(evaluaciones.nota)', 'promedio')
      .groupBy('docente.nombres')
      .getRawMany();

    const labels = rendimiento.map((r) => r.docente);
    const data = rendimiento.map((r) => Number(r.promedio));
    return { labels, data };
  }

  async getAllClasesEstudiante(id_estudiante:string){
    return await this.claseRepository.find({
      where: {
        inscritos: {
          estudiante: {
            id_estudiante,
          },
        },
      },
      order: {
        id_clase: 'ASC',
      },
      relations: ['materia', 'docente', 'materia.semestre', 'estado'],
    });
  }

  async getClasesByDocente(id_docente: string) {
    return await this.claseRepository.find({
      where: {
        docente: {
          id_docente,
        },
      },
      order: {
        id_clase: 'ASC',
      },
      relations: ['materia', 'docente', 'materia.semestre', 'estado'],
    });
  }

  async findOne(id: number) {
    return await this.claseRepository.findOne({
      where: {
        id_clase: id,
      },
      relations: ['materia', 'docente', 'materia.semestre', 'estado'],
    });
  }

  async update(id: number, updateClaseDto: UpdateClaseDto) {
    const clase = await this.claseRepository.findOne({
      where: {
        id_clase: id,
      },
    });

    // Validar los días de la semana
    const diasValidos = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];

    if (updateClaseDto.dias) {
      const diasInvalidos = updateClaseDto.dias.filter(
        (dia) => !diasValidos.includes(dia),
      );
      if (diasInvalidos.length > 0) {
        throw new BadRequestException(
          `Días inválidos: ${diasInvalidos.join(', ')}`,
        );
      }
    }

    if (!clase) {
      throw new NotFoundException('Clase no encontrada');
    }
    if (updateClaseDto.horario) {
      const [horaInicio, horaFin] = this.descomponerHorario(
        updateClaseDto.horario,
      );
      clase.horaInicio = horaInicio;
      clase.horaFin = horaFin;
    }

    const materia = await this.materiaRepository.findOneBy({
      id_materia: updateClaseDto.id_materia,
    });
    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    const docente = await this.docenteRepository.findOneBy({
      id_docente: updateClaseDto.id_docente,
    });
    if (!docente) {
      throw new NotFoundException('Docente no encontrada');
    }
    clase.materia = materia;
    clase.docente = docente;
    delete updateClaseDto.id_docente;
    delete updateClaseDto.id_materia;
    Object.assign(clase, updateClaseDto);
    return await this.claseRepository.update(id, clase);
  }

  async remove(id: number) {
    const administrador = await this.findOne(id);

    if (!administrador) {
      throw new Error('Docente no encontrado');
    }

    if (administrador.estado.nombre === EnumEstados.ACTIVO) {
      const newEstado = await this.estadoService.findByName(
        EnumEstados.INACTIVO,
      );
      administrador.estado = newEstado;
      return this.claseRepository.save(administrador);
    }

    if (administrador.estado.nombre === EnumEstados.INACTIVO) {
      const newEstado = await this.estadoService.findByName(EnumEstados.ACTIVO);
      administrador.estado = newEstado;
      return this.claseRepository.save(administrador);
    }
  }
}
