import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import { EstadoEst } from './entities/estado.enum';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { EstadoEspecialidad } from 'src/especialidades/entities/estado.enum';
import { Inscrito } from 'src/inscritos/entities/inscrito.entity';

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Especialidad)
    private readonly especialidadRepository: Repository<Especialidad>,
    @InjectRepository(Inscrito)
    private readonly inscritoRepository: Repository<Inscrito>,
  ) {}
  async create(createEstudianteDto: CreateEstudianteDto) {
    const estudiante = this.estudianteRepository.create(createEstudianteDto);
    estudiante.id_estudiante = await this.genId(
      estudiante.nombres,
      estudiante.apellidos,
      estudiante.carnet,
    );
    const especialidad = await this.especialidadRepository.findOneBy({
      id_especialidad: createEstudianteDto.id_especialidad,
    });
    if (!especialidad) {
      throw new BadRequestException('Especialidad no existe');
    }

    // if (especialidad.estado == EstadoEspecialidad.INACTIVO) {
    //   throw new BadRequestException('Especialidad inactiva');
    // }

    return await this.estudianteRepository.save({
      ...estudiante,
      especialidad,
    });
  }

  async findEstudiantesNoInscritos(
    query: PaginateQuery,
    id_clase: string,
    id_materia: string,
  ): Promise<Paginated<Inscrito>> {
    

    return paginate(query, this.inscritoRepository,{
      relations:['estudiante'],
      sortableColumns:['clase']
    })
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
}
