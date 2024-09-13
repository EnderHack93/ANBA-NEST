import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Especialidad)
    private readonly especialidadRepository: Repository<Especialidad>,
  ) {}

  async seed() {
    await this.createEspecialidades();
  }
  async createEspecialidades() {
    const especialidades = [
      {
        nombre: 'Pintura',
      },
      {
        nombre: 'Ceramica',
      },
      {
        nombre: 'Dibujo',
      },
      {
        nombre: 'Escultura',
      },
      {
        nombre: 'Graficas',
      },
    ];

    for (const especialidad of especialidades) {
      const newEspecialidad = this.especialidadRepository.create(especialidad);
      await this.especialidadRepository.save(newEspecialidad);
    }

    console.log('Especialidades creadas exitosamente');
  }
}
