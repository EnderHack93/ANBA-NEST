import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { SemestreService } from './semestre.service';
import { CreateSemestreDto } from './dto/create-semestre.dto';
import { UpdateSemestreDto } from './dto/update-semestre.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Semestres")
@Controller('semestre')
export class SemestreController {
  constructor(private readonly semestreService: SemestreService) {}

  @Post()
  create(@Body() createSemestreDto: CreateSemestreDto) {
    return this.semestreService.create(createSemestreDto);
  }

  @Get()
  findAll() {
    return this.semestreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semestreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSemestreDto: UpdateSemestreDto) {
    return this.semestreService.update(+id, updateSemestreDto);
  }

  @Put(':id')
  changeState(@Param('id') id: number) {
    return this.semestreService.changeState(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.semestreService.remove(+id);
  }
}
