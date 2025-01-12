import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { AdministradoresService } from './administradores.service';
import { CreateAdministradorDto } from './dto/create-administrador.dto';
import { UpdateAdministradoreDto } from './dto/update-administrador.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Administrador } from './entities/administrador.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('administradores')
@ApiTags("Administradores")
export class AdministradoresController {
  constructor(private readonly administradoresService: AdministradoresService
  ) {}

  @Post()
  create(@Body() createAdministradoreDto: CreateAdministradorDto) {
    return this.administradoresService.create(createAdministradoreDto);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery):Promise<Paginated<Administrador>> {
    return this.administradoresService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.administradoresService.findOne(id);
  }

  @Put(':id')
  changeState(@Param('id') id: string) {
    return this.administradoresService.changeState(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdministradoreDto: UpdateAdministradoreDto) {
    return this.administradoresService.update(+id, updateAdministradoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.administradoresService.remove(+id);
  }
}
