import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInscritoDto } from './dto/create-inscrito.dto';
import { UpdateInscritoDto } from './dto/update-inscrito.dto';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Inscrito } from './entities/inscrito.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { Clase } from 'src/clases/entities/clase.entity';

@Injectable()
export class InscritosService {
  constructor(
    @InjectRepository(Inscrito)
    private readonly inscritosRepository: Repository<Inscrito>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
  ) {}
  async create(createInscritoDto: CreateInscritoDto) {
    const inscritos = this.inscritosRepository.create(createInscritoDto);

    const clase = await this.claseRepository.findOneBy({
      id_clase: createInscritoDto.id_clase,
    });

    const estudiante = await this.estudianteRepository.findOneBy({
      id_estudiante: createInscritoDto.id_estudiante,
    });

    return await this.inscritosRepository.save({
      ...inscritos,
      clase,
      estudiante,
    });
  }

  findAll(query: PaginateQuery,id_clase:string): Promise<Paginated<Inscrito>> {
    const queryBuilder = this.inscritosRepository
    .createQueryBuilder('inscrito')
    .leftJoinAndSelect('inscrito.clase', 'clase')
    .leftJoinAndSelect('inscrito.estudiante', 'estudiante')
    .where('inscrito.clase = :id_clase', { id_clase })

    return paginate(query, queryBuilder, {
      relations: ['clase', 'estudiante'],
      sortableColumns: ['id_inscrito', 'fecha_inscripcion'],
      searchableColumns: ['id_inscrito', 'fecha_inscripcion'],
      defaultSortBy: [['id_inscrito', 'ASC']],
      filterableColumns: {
        fecha_inscripcion: [FilterOperator.ILIKE],
        id_estudiante: [FilterOperator.ILIKE],
        id_clase: [FilterOperator.ILIKE],
      },
    });
  }

  async findInscritosByClase(id_clase: number){

    const inscritos = await this.inscritosRepository
      .createQueryBuilder('inscrito')
      .leftJoinAndSelect('inscrito.estudiante', 'estudiante')
      .where('inscrito.clase.id_clase = :id_clase', { id_clase })
      .getMany();

    return inscritos.map(inscrito => ({
      id_estudiante: inscrito.estudiante.id_estudiante,
      nombres: inscrito.estudiante.nombres,
      apellidos: inscrito.estudiante.apellidos,
      carnet: inscrito.estudiante.carnet,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} inscrito`;
  }

  update(id: number, updateInscritoDto: UpdateInscritoDto) {
    return `This action updates a #${id} inscrito`;
  }


  remove(id: number) {
    return this.inscritosRepository.delete({
      id_inscrito: id,
    });
  }
}
