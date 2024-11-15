import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { MateriasService } from './materias.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Materia } from './entities/materia.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Materias")
@Controller('materias')
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Post()
  create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiasService.create(createMateriaDto);
  }

  @Get()
  findAll(@Paginate() query:PaginateQuery):Promise<Paginated<Materia>> {
    return this.materiasService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materiasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMateriaDto: UpdateMateriaDto) {
    return this.materiasService.update(+id, updateMateriaDto);
  }

  @Put(':id')
  changeState(@Param('id') id: string) {
    return this.materiasService.changeState(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materiasService.remove(+id);
  }
}
