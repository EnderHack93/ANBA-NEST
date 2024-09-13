import { Injectable } from '@nestjs/common';
import { CreateInscritoDto } from './dto/create-inscrito.dto';
import { UpdateInscritoDto } from './dto/update-inscrito.dto';

@Injectable()
export class InscritosService {
  create(createInscritoDto: CreateInscritoDto) {
    return 'This action adds a new inscrito';
  }

  findAll() {
    return `This action returns all inscritos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inscrito`;
  }

  update(id: number, updateInscritoDto: UpdateInscritoDto) {
    return `This action updates a #${id} inscrito`;
  }

  remove(id: number) {
    return `This action removes a #${id} inscrito`;
  }
}
