import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import { EstadoEsp } from 'src/especialidades/entities/estado.enum';
import { EstadoEst } from './entities/estado.enum';
import { PaginationDto } from 'src/common/pagination.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Especialidad)
    private readonly especialidadRepository: Repository<Especialidad>,
  ) {}
  async create(createEstudianteDto: CreateEstudianteDto) {
    const estudiante = this.estudianteRepository.create(createEstudianteDto);
    estudiante.id_estudiante = await this.genId(
      estudiante.nombres,
      estudiante.apellidos,
      estudiante.carnet,
    );
    const especialidad = await this.especialidadRepository.findOneBy({
      nombre: createEstudianteDto.id_especialidad,
    });
    if(!especialidad){
      throw new BadRequestException('Especialidad no existe');
    }

    if(especialidad.estado == EstadoEsp.INACTIVO){
      throw new BadRequestException('Especialidad inactiva');
    }

    return await this.estudianteRepository.save({
      ...estudiante,
      especialidad
    });
  }

  async findAll() {
    return await this.estudianteRepository.find();
  }

  async findOne(id: string) {
    return await this.estudianteRepository.findBy({ id_estudiante: id });
  }

  async update(id: string, updateEstudianteDto: UpdateEstudianteDto) {
    return await this.estudianteRepository.update(id, updateEstudianteDto);
  }

  async remove(id: string) {
    return await this.estudianteRepository.softDelete({ id_estudiante: id });
  }
  async changeState(id: string) {
    const estudiante = await this.estudianteRepository.findOneBy({id_estudiante:id})
    
    estudiante.estado = estudiante.estado === EstadoEst.ACTIVO
    ? EstadoEst.INACTIVO
    : EstadoEst.ACTIVO;

    return await this.estudianteRepository.save(estudiante)
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