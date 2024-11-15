import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asistencia } from './entities/asistencia.entity';
import { Clase } from 'src/clases/entities/clase.entity';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { InscritosService } from 'src/inscritos/inscritos.service';
import { EnumAsistencia } from './enums/asistencia.enum';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { CreateRegistroAsistenciaDto } from './dto/create-registro-asistencia.dto';

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectRepository(Asistencia)
    private readonly asistenciaRepository: Repository<Asistencia>,
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
    private readonly inscritosService: InscritosService,
  ) {}

  async findByDocente(
    query: PaginateQuery,
    id_docente: string,
  ): Promise<Paginated<Asistencia>> {
    return paginate(query, this.asistenciaRepository, {
      where: { clase: { docente: { id_docente } } },
      relations: ['clase', 'estudiante'],
      sortableColumns: ['id_asistencia', 'fecha'],
      searchableColumns: ['id_asistencia', 'fecha'],
      defaultSortBy: [['id_asistencia', 'ASC']],
      filterableColumns: {
        fecha: [FilterOperator.ILIKE],
        asistio: [FilterOperator.ILIKE],
        'clase.id_clase': [FilterOperator.ILIKE],
        id_estudiante: [FilterOperator.ILIKE],
      },
    });
  }

  async cambiarEstadoAsistencia(id_asistencia: number, updateAsistenciaDto: UpdateAsistenciaDto) {
    const { nuevoEstado } = updateAsistenciaDto;
    const asistencia = await this.asistenciaRepository.findOne({
      where: { id_asistencia },
    });
    if (!asistencia) {
      throw new NotFoundException('Asistencia no encontrada');
    }
    asistencia.asistio = nuevoEstado;
    return await this.asistenciaRepository.save(asistencia);
  }

  async marcarAsistencia(
    createAsistenciaDto: CreateAsistenciaDto,
  ): Promise<Asistencia> {
    const { id_clase, id_estudiante, asistio } = createAsistenciaDto;
    const clase = await this.claseRepository.findOne({
      where: { id_clase },
      relations: ['docente'],
    });

    if (!clase) {
      throw new NotFoundException('Clase no encontrada');
    }

    const asistencia = await this.asistenciaRepository.save({
      clase,
      estudiante: { id_estudiante },
      fecha: new Date(),
      asistio,
    });

    return asistencia;
  }

  async iniciarRegistroAsistencia(createRegistroAsistenciaDto: CreateRegistroAsistenciaDto) {
    const { id_clase, fecha } = createRegistroAsistenciaDto;
    const clase = await this.claseRepository.findOne({
      where: { id_clase },
    });

    if (!clase) {
      throw new NotFoundException('Clase no encontrada');
    }

    const inscritos = await this.inscritosService.findInscritosByClase(
      clase.id_clase,
    );

    //Crear registro de asistencia inicial como "Falta" para cada estudiante
    const asistencias = inscritos.map((estudiante) => {
      return this.asistenciaRepository.create({
        clase,
        estudiante,
        asistio: EnumAsistencia.FALTO,
        fecha,
      });
    });

    return this.asistenciaRepository.save(asistencias);
  }
}
