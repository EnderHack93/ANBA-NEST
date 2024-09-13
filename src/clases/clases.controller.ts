import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClasesService } from './clases.service';
import { CreateClaseDto } from './dto/create-clase.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Clase } from './entities/clase.entity';

@Controller('clases')
export class ClasesController {
  constructor(private readonly clasesService: ClasesService) {}

  @Post()
  create(@Body() createClaseDto: CreateClaseDto) {
    return this.clasesService.create(createClaseDto);
  }

  @Get()
  findAll(@Paginate() query:PaginateQuery):
  Promise<Paginated<Clase>> {
    return this.clasesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clasesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClaseDto: UpdateClaseDto) {
    return this.clasesService.update(+id, updateClaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clasesService.remove(+id);
  }
}
