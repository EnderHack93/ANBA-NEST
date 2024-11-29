import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Materia } from './entities/materia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoMateria } from './entities/estado.enum';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import { EnumEstados } from 'src/common/enums/estados.enum';
import { EstadoService } from 'src/estados/estado.service';
import { SemestreService } from 'src/semestre/semestre.service';

@Injectable()
export class MateriasService {
  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>,
    @InjectRepository(Especialidad)
    private readonly especialidadRepository: Repository<Especialidad>,
    private readonly estadoService: EstadoService,
    private readonly semestreService: SemestreService,
  ) {}

  async create(createMateriaDto: CreateMateriaDto) {
    const semestre = await this.semestreService.findOne(
      createMateriaDto.id_semestre,
    );
    const estado = await this.estadoService.findByName(EnumEstados.ACTIVO);

    if (!semestre) {
      throw new BadRequestException('Semestre no encontrado');
    }

    const materia = this.materiaRepository.create({
      ...createMateriaDto,
      semestre,
      estado,
    });

    const especialidad = await this.especialidadRepository.findOneBy({
      id_especialidad: createMateriaDto.id_especialidad,
    });

    if (!especialidad) {
      throw new BadRequestException('Especialidad no existe');
    }

    if (especialidad.estado.nombre == EnumEstados.INACTIVO) {
      throw new BadRequestException('Especialidad inactiva');
    }

    return await this.materiaRepository.save({
      ...materia,
      especialidad,
    });
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Materia>> {
    return paginate(query, this.materiaRepository, {
      relations: ['especialidad', 'estado', 'semestre'],
      sortableColumns: ['id_materia', 'nombre'],
      searchableColumns: ['id_materia', 'nombre', 'especialidad.nombre'],
      defaultSortBy: [['id_materia', 'ASC']],
      filterableColumns: {
        'estado.nombre': [FilterOperator.EQ],
        nombre: [FilterOperator.ILIKE],
        semestre: [FilterOperator.ILIKE],
        'especialidad.nombre': [FilterOperator.EQ],
      },
    });
  }

  // Obtener el crecimiento de estudiantes
  async getCrecimientoEstudiantes() {
    const crecimiento = await this.materiaRepository
      .createQueryBuilder('materia')
      .leftJoinAndSelect('materia.semestre', 'semestre')
      .leftJoinAndSelect('materia.clases', 'clase')
      .leftJoinAndSelect('clase.inscritos', 'inscrito')
      .select([
        'materia.id_materia', // Incluye esta columna en el SELECT
        'semestre.nombre AS semestre',
        'COUNT(inscrito.id_inscrito) AS total',
      ])
      .groupBy('materia.id_materia') // Agrupa por esta columna
      .addGroupBy('semestre.nombre') // También agrupa por el semestre
      .getRawMany();

    const labels = crecimiento.map((c) => c.semestre);
    const data = crecimiento.map((c) => Number(c.total));
    return { labels, data };
  }

  async findOne(id: number) {
    return await this.materiaRepository.findOne({
      where: {
        id_materia: id,
      },
      relations: ['especialidad', 'estado', 'semestre'],
    });
  }

  async findMateriasBySemestre(id_semestre: number) {
    const semestre = await this.semestreService.findOne(id_semestre);

    if (!semestre) {
      throw new BadRequestException('Semestre no encontrado');
    }

    return await this.materiaRepository.find({
      where: {
        semestre,
      },
    });
  }

  async update(id: number, updateMateriaDto: UpdateMateriaDto) {
    const materia = await this.materiaRepository.findOneBy({
      id_materia: id,
    });

    if (!materia) {
      throw new BadRequestException('Materia no existe');
    }

    const especialidad = await this.especialidadRepository.findOneBy({
      id_especialidad: updateMateriaDto.id_especialidad,
    });

    if (!especialidad) {
      throw new BadRequestException('Especialidad no existe');
    }

    if (especialidad.estado.nombre == EnumEstados.INACTIVO) {
      throw new BadRequestException('Especialidad inactiva');
    }

    const semestre = await this.semestreService.findOne(
      updateMateriaDto.id_semestre,
    );

    if (!semestre) {
      throw new BadRequestException('Semestre no encontrado');
    }

    materia.semestre = semestre;
    materia.especialidad = especialidad;
    delete updateMateriaDto.id_especialidad;
    delete updateMateriaDto.id_semestre;
    Object.assign(materia, updateMateriaDto);

    return await this.materiaRepository.update(id, materia);
  }

  async remove(id: number) {
    return await this.materiaRepository.delete(id);
  }

  async changeState(id: number) {
    const materia = await this.materiaRepository.findOneBy({
      id_materia: id,
    });

    if (!materia) {
      throw new BadRequestException('Especialidad no encontrada');
    }

    const estado = materia.estado;

    if (!estado) {
      throw new BadRequestException('Estado no encontrado');
    }

    if (estado.nombre === EnumEstados.ACTIVO) {
      const newEstado = await this.estadoService.findByName(
        EnumEstados.INACTIVO,
      );
      materia.estado = newEstado;
    }

    if (estado.nombre === EnumEstados.INACTIVO) {
      const newEstado = await this.estadoService.findByName(EnumEstados.ACTIVO);
      materia.estado = newEstado;
    }

    return await this.materiaRepository.save(materia);
  }
}
