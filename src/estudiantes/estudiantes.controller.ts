import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Estudiante } from './entities/estudiante.entity';

@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Post()
  create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudiantesService.create(createEstudianteDto);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Estudiante>> {
    return this.estudiantesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estudiantesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto,
  ) {
    return this.estudiantesService.update(id, updateEstudianteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estudiantesService.remove(id);
  }
  @Put(':id')
  changeState(@Param('id') id: string) {
    return this.estudiantesService.changeState(id);
  }
}
