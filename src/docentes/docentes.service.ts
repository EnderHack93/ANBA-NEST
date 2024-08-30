import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { randomInt } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Docente } from './entities/docente.entity';
import { Repository } from 'typeorm';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import { EstadoEsp } from 'src/especialidades/entities/estado.enum';
import { EstadoDocentes } from './entities/estado.enum';

@Injectable()
export class DocentesService {
  
  constructor(
    @InjectRepository(Docente)
    private readonly docenteRepository: Repository<Docente>,
    @InjectRepository(Especialidad)
    private readonly especialidadRepository: Repository<Especialidad>,
  ){}
  async create(createDocenteDto: CreateDocenteDto) {
    const docente = this.docenteRepository.create(createDocenteDto)
    docente.id_docente = await this.genId(
      createDocenteDto.nombres,
      createDocenteDto.apellidos,
      createDocenteDto.carnet
    );
    const especialidad = await this.especialidadRepository.findOneBy({
      nombre: createDocenteDto.id_especialidad,
    })

    if(!especialidad){
      throw new BadRequestException('Especialidad no existe');
    }

    if(especialidad.estado == EstadoEsp.INACTIVO){
      throw new BadRequestException('Especialidad inactiva');
    }

    return await this.docenteRepository.save({
      ...docente,
      especialidad
    })
  }

  async changeState(id: string) {
    const docente = await this.docenteRepository.findOneBy({id_docente:id})
    
    docente.estado = docente.estado === EstadoDocentes.ACTIVO
    ? EstadoDocentes.INACTIVO
    : EstadoDocentes.ACTIVO;

    return await this.docenteRepository.save(docente)
  }
  async findAll() {
    return await this.docenteRepository.find();
  }

  async findOne(id: string) {
    return await this.docenteRepository.findOneBy({ id_docente: id });
  }

  async update(id: string, updateDocenteDto: UpdateDocenteDto) {
    return await this.docenteRepository.update(id, updateDocenteDto);
  }

  async remove(id: string) {
    return await this.docenteRepository.softDelete({ id_docente: id });
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
