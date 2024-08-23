import { Injectable } from '@nestjs/common';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Especialidad } from './entities/especialidad.entity';
import { Repository } from 'typeorm';
import { EstadoEsp } from './entities/estado.enum';

@Injectable()
export class EspecialidadesService {
  constructor(@InjectRepository(Especialidad)
  private readonly especialidadRepository: Repository<Especialidad>,
){}
  async create(createEspecialidadeDto: CreateEspecialidadDto) {
    return await this.especialidadRepository.save(createEspecialidadeDto);
  }

  async findAll() {
    return await this.especialidadRepository.find();
  }

  async findOne(id: number) {
    return await this.especialidadRepository.findOneBy({id_especialidad: id});
  }

  async update(id: number, updateEspecialidadeDto: UpdateEspecialidadDto) {
    return await this.especialidadRepository.update(id,updateEspecialidadeDto);
  }

  async remove(id: number) {
    const especialidad = await this.especialidadRepository.findOneBy({id_especialidad:id})
    
    especialidad.estado = especialidad.estado === EstadoEsp.ACTIVO
    ? EstadoEsp.INACTIVO
    : EstadoEsp.ACTIVO;

    return await this.especialidadRepository.save(especialidad)
  }
}
