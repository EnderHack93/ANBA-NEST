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
import { EstadoEspecialidad } from 'src/especialidades/entities/estado.enum';

@Injectable()
export class MateriasService {
  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>,
    @InjectRepository(Especialidad)
    private readonly especialidadRepository: Repository<Especialidad>,
  ) {}

  async create(createMateriaDto: CreateMateriaDto) {
    const materia = this.materiaRepository.create(createMateriaDto);

    const especialidad = await this.especialidadRepository.findOneBy({
      id_especialidad: createMateriaDto.id_especialidad,
    });

    if (!especialidad) {
      throw new BadRequestException('Especialidad no existe');
    }

    // if (especialidad.estado == EstadoEspecialidad.INACTIVO) {
    //   throw new BadRequestException('Especialidad inactiva');
    // }

    return await this.materiaRepository.save({
      ...materia,
      especialidad,
    });
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Materia>> {
    return paginate(query, this.materiaRepository, {
      relations: ['especialidad'],
      sortableColumns: ['id_materia', 'nombre'],
      searchableColumns: ['id_materia', 'nombre','especialidad.nombre','semestre'],
      defaultSortBy: [['id_materia', 'ASC']],
      filterableColumns: {
        estado: [FilterOperator.EQ],
        nombre: [FilterOperator.ILIKE],
        semestre: [FilterOperator.ILIKE],
        "especialidad.nombre": [FilterOperator.ILIKE],
      },
    });
  }

  async findOne(id: number) {
    return await this.materiaRepository.findOneBy({
      id_materia: id,
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

    // if (especialidad.estado == EstadoEspecialidad.INACTIVO) {
    //   throw new BadRequestException('Especialidad inactiva');
    // }

    materia.especialidad = especialidad;
    delete updateMateriaDto.id_especialidad;
    Object.assign(materia,updateMateriaDto)

    return await this.materiaRepository.update(id,materia);
  }

  async remove(id: number) {
    return await this.materiaRepository.delete(id)
  }


  async changeState(id: number) {
    const materia = await this.materiaRepository.findOneBy({
      id_materia: id,
    });

    materia.estado =
      materia.estado === EstadoMateria.ACTIVO
        ? EstadoMateria.INACTIVO
        : EstadoMateria.ACTIVO;

    return await this.materiaRepository.save(materia);
  }
}
