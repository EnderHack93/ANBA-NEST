import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asistencia } from './entities/asistencia.entity';
import { Clase } from 'src/clases/entities/clase.entity';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectRepository(Asistencia)
    private readonly asistenciaRepository: Repository<Asistencia>,
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
  ) {}

  async findByDocente(id_docente: string): Promise<Asistencia[]> {
    return this.asistenciaRepository.find({
      where: { clase: { docente: { id_docente } } },
      relations: ['clase', 'estudiante'],
    });
  }

  async marcarAsistencia(createAsistenciaDto:CreateAsistenciaDto
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
}
