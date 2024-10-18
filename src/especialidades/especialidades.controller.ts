import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { EspecialidadesService } from './especialidades.service';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('especialidades')
export class EspecialidadesController {
  constructor(private readonly especialidadesService: EspecialidadesService) {}

  @Post()
  create(@Body() createEspecialidadeDto: CreateEspecialidadDto) {
    return this.especialidadesService.create(createEspecialidadeDto);
  }

  @Get()
  findAll(@Paginate() query:PaginateQuery):Promise<Paginated<any>> {
    return this.especialidadesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.especialidadesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEspecialidadeDto: UpdateEspecialidadDto) {
    return this.especialidadesService.update(+id, updateEspecialidadeDto);
  }

  @Put(":id")
  changeState(@Param('id') id: number) {
    return this.especialidadesService.changeState(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.especialidadesService.remove(+id);
  }
}
