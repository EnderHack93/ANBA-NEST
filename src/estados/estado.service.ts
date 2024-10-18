import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './entites/estado.entity';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { EnumEstados } from 'src/common/enums/estados.enum';

@Injectable()
export class EstadoService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  // Crear un nuevo estado
  async create(createEstadoDto: CreateEstadoDto) {
    await this.validateIfExists(createEstadoDto)
    const nuevoEstado = this.estadoRepository.create(createEstadoDto);
    return this.estadoRepository.save(nuevoEstado);
  }

  // Validar si el estado ya existe
  async validateIfExists({nombre}: CreateEstadoDto) {
    const estado = await this.estadoRepository.findOneBy({nombre});
    if (estado) {
      throw new BadRequestException(
        `El estado ${nombre} ya existe`,
      );
    }
  }

  // Obtener todos los estados
  async findAll(): Promise<Estado[]> {
    return this.estadoRepository.find();
  }

  // Obtener un estado por ID
  async findOne(id: number): Promise<Estado> {
    const estado = await this.estadoRepository.findOneBy({ id });
    if (!estado) {
      throw new NotFoundException(`Estado con ID ${id} no encontrado`);
    }
    return estado;
  }

  // Obtener un estado por nombre
  async findByName(nombre: EnumEstados): Promise<Estado> {
    const estado = await this.estadoRepository.findOneBy({ nombre });
    if (!estado) {
      throw new NotFoundException(`Estado con nombre ${nombre} no encontrado`);
    }
    return estado;
  }

  // Modificar un estado existente
  async update(id: number, updateEstadoDto: UpdateEstadoDto): Promise<Estado> {
    const estado = await this.findOne(id);
    Object.assign(estado, updateEstadoDto);
    return this.estadoRepository.save(estado);
  }

  // Eliminar un estado
  async remove(id: number): Promise<void> {
    const estado = await this.findOne(id);
    await this.estadoRepository.remove(estado);
  }
}
