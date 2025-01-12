import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { DocentesService } from './docentes.service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { query } from 'express';
import { Docente } from './entities/docente.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Docentes")
@Controller('docentes')
export class DocentesController {
  constructor(private readonly docentesService: DocentesService) {}

  @Post()
  create(@Body() createDocenteDto: CreateDocenteDto) {
    return this.docentesService.create(createDocenteDto);
  }

  @Get()
  findAll(@Paginate() query:PaginateQuery):Promise<Paginated<Docente>> {
    return this.docentesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docentesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocenteDto: UpdateDocenteDto) {
    return this.docentesService.update(id, updateDocenteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.docentesService.remove(id);
  }

  @Put(':id')
  changeState(@Param('id') id:string){
    return this.docentesService.changeState(id);
  }
}
