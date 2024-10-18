import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Especialidad } from './entities/especialidad.entity';
import { Repository } from 'typeorm';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { EstadoService } from 'src/estados/estado.service';
import { EnumEstados } from 'src/common/enums/estados.enum';

@Injectable()
export class EspecialidadesService {
  constructor(
    @InjectRepository(Especialidad)
    private readonly especialidadRepository: Repository<Especialidad>,
    private readonly estadoService: EstadoService,
  ) {}
  async create(createEspecialidadDto: CreateEspecialidadDto) {
    // Buscar el estado por su nombre o id, en este caso el estado "Activo"
    const estadoActivo = await this.estadoService.findByName(
      EnumEstados.ACTIVO,
    );

    // Crear la especialidad y asignar el estado por defecto si no está presente
    const nuevaEspecialidad = this.especialidadRepository.create({
      ...createEspecialidadDto,
      estado: estadoActivo, // Asignar el estado "Activo" por defecto
    });

    return this.especialidadRepository.save(nuevaEspecialidad);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Especialidad>> {
    return paginate(query, this.especialidadRepository, {
      relations: ['estado'],
      sortableColumns: ['id_especialidad', 'nombre'],
      searchableColumns: ['id_especialidad', 'nombre'],
      defaultSortBy: [['id_especialidad', 'ASC']],
      filterableColumns: {
        nombre: [FilterOperator.ILIKE],
        semestre: [FilterOperator.ILIKE],
        "estado.nombre": [FilterOperator.ILIKE],
      },
    });
  }

  async findOne(id: number) {
    return await this.especialidadRepository.findOneBy({ id_especialidad: id });
  }

  async update(id: number, updateEspecialidadeDto: UpdateEspecialidadDto) {
    const especialidad = await this.especialidadRepository.findOneBy({ id_especialidad: id
    });

    if (!especialidad) {
      throw new BadRequestException('Especialidad no encontrada');
    }

    return await this.especialidadRepository.update(id, updateEspecialidadeDto);
  }

  async remove(id: number) {
    return await this.especialidadRepository.delete(id);
  }

  async changeState(id: number) {
    const especialidad = await this.especialidadRepository.findOneBy({
      id_especialidad: id,
    });

    if (!especialidad) {
      throw new BadRequestException('Especialidad no encontrada');
    }

    const estado = especialidad.estado;

    if (!estado) {
      throw new BadRequestException('Estado no encontrado');
    }

    if (estado.nombre == EnumEstados.INACTIVO) {
      const newEstado = await this.estadoService.findByName(EnumEstados.ACTIVO);
      especialidad.estado = newEstado;
      return await this.especialidadRepository.save(especialidad);
    }

    if (estado.nombre == EnumEstados.ACTIVO) {
      const newEstado = await this.estadoService.findByName(EnumEstados.INACTIVO);
      especialidad.estado = newEstado;
      return await this.especialidadRepository.save(especialidad);
    }
    
  }
}
