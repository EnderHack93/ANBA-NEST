import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSemestreDto } from './dto/create-semestre.dto';
import { UpdateSemestreDto } from './dto/update-semestre.dto';
import { Repository } from 'typeorm';
import { Semestre } from './entities/semestre.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoService } from 'src/estados/estado.service';
import { EnumEstados } from 'src/common/enums/estados.enum';

@Injectable()
export class SemestreService {
  constructor(
    @InjectRepository(Semestre)
    private readonly semestreRepository: Repository<Semestre>,
    private readonly estadoService:EstadoService
  ) {}
  async create(createSemestreDto: CreateSemestreDto) {
    const estado =  await this.estadoService.findByName(EnumEstados.ACTIVO)
    const semestre = this.semestreRepository.create({
      ...createSemestreDto,
      estado
    });
    return this.semestreRepository.save(semestre);
  }

  async findAll() {
    return this.semestreRepository.find({
      where:{estado:{nombre:EnumEstados.ACTIVO}},
    }
    );
  }

  async findOne(id_semestre: number) {
    const semestre = await this.semestreRepository.findOneBy({ id_semestre });

    if (!semestre) {
      throw new BadRequestException('Semestre no encontrado');
    }

    if(semestre.estado.nombre === EnumEstados.INACTIVO){
      throw new BadRequestException('Semestre inactivo');
    }

    return semestre;
  }

  update(id: number, updateSemestreDto: UpdateSemestreDto) {
    return `This action updates a #${id} semestre`;
  }
  
  async changeState(id:number){
    const semestre = await this.findOne(id);
    
    if(!semestre){
      throw new Error('Semestre no encontrado');
    }

    if(semestre.estado.nombre === EnumEstados.ACTIVO){
      const newEstado = await this.estadoService.findByName(EnumEstados.INACTIVO);
      semestre.estado = newEstado;
      return this.semestreRepository.save(semestre);
    }

    if(semestre.estado.nombre === EnumEstados.INACTIVO){
      const newEstado = await this.estadoService.findByName(EnumEstados.ACTIVO);
      semestre.estado = newEstado;
      return this.semestreRepository.save(semestre);
    }
    

    
  }

  remove(id: number) {
    return `This action removes a #${id} semestre`;
  }
}
