import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InscritosService } from './inscritos.service';
import { CreateInscritoDto } from './dto/create-inscrito.dto';
import { UpdateInscritoDto } from './dto/update-inscrito.dto';

@Controller('inscritos')
export class InscritosController {
  constructor(private readonly inscritosService: InscritosService) {}

  @Post()
  create(@Body() createInscritoDto: CreateInscritoDto) {
    return this.inscritosService.create(createInscritoDto);
  }

  @Get()
  findAll() {
    return this.inscritosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inscritosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInscritoDto: UpdateInscritoDto) {
    return this.inscritosService.update(+id, updateInscritoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inscritosService.remove(+id);
  }
}