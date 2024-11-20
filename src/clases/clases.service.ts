import { BadRequestException, Injectable } from '@nestjs/common';
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
import { estado } from './entities/clase.enum';
import { Materia } from 'src/materias/entities/materia.entity';
import { Docente } from 'src/docentes/entities/docente.entity';
import { EstadoMateria } from 'src/materias/entities/estado.enum';
import { EstadoDocentes } from 'src/docentes/entities/estado.enum';
import { EnumEstados } from 'src/common/enums/estados.enum';

@Injectable()
export class ClasesService {
  constructor(
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>,
    @InjectRepository(Docente)
    private readonly docenteRepository: Repository<Docente>,
  ) {}
  async create(createClaseDto: CreateClaseDto) {
    const clase = this.claseRepository.create(createClaseDto);

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
  
  

  async findAll(query: PaginateQuery): Promise<Paginated<Clase>> {
    const clases = this.claseRepository
      .createQueryBuilder('clase')
      .leftJoinAndSelect('clase.materia', 'materia')
      .leftJoinAndSelect('materia.especialidad', 'especialidad')
      .leftJoinAndSelect('materia.semestre', 'semestre')
      .leftJoinAndSelect('clase.docente', 'docente')

    return paginate(query, clases, {
      relations: ['materia', 'docente','materia.especialidad','materia.semestre'],
      sortableColumns: ['id_clase', 'nombre'],
      searchableColumns: ['id_clase', 'nombre'],
      defaultSortBy: [['id_clase', 'ASC']],
      filterableColumns: {
        estado: [FilterOperator.EQ], 
        nombre: [FilterOperator.ILIKE],
        semestre: [FilterOperator.ILIKE],
        docente: [FilterOperator.ILIKE],
        "materia.especialidad.nombre": [FilterOperator.ILIKE],

      },
    });
  }

  async findOne(id: number) {
    return await this.claseRepository.findOne({
      where: {
        id_clase: id,
      },
      relations: ['materia', 'docente','materia.semestre'],
    });
  }

  async update(id: number, updateClaseDto: UpdateClaseDto) {
    return await this.claseRepository.update(id, updateClaseDto);
  }

  async remove(id: number) {
    const clase = await this.claseRepository.findOneBy({
      id_clase: id,
    });

    clase.estado =
      clase.estado === estado.ACTIVO ? estado.INACTIVO : estado.ACTIVO;
    return await this.claseRepository.save(clase);
  }
}
