import { Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}
  async create(createEstudianteDto: CreateEstudianteDto) {
    const estudiante = this.estudianteRepository.create(createEstudianteDto);
    estudiante.id_estudiante = await this.genId(
      estudiante.nombres,
      estudiante.apellidos,
      estudiante.carnet
    )
    return await this.estudianteRepository.save(estudiante);
  }

  async findAll() {
    return await this.estudianteRepository.find();
  }

  async findOne(id: number) {
    return `This action returns a #${id} estudiante`;
  }

  async update(id: number, updateEstudianteDto: UpdateEstudianteDto) {
    return `This action updates a #${id} estudiante`;
  }

  async remove(id: number) {
    return `This action removes a #${id} estudiante`;
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
