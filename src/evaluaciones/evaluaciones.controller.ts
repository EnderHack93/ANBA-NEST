import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EvaluacionesService } from './evaluaciones.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { ChangeEvaluacionDto } from './dto/change-evaluacion.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Evaluacion } from './entities/evaluacion.entity';
import { ApiTags } from '@nestjs/swagger';
import { IniciarRegistrosDto } from './dto/iniciar-registros.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorators';
import { EnumRoles } from 'src/common/enums/roles.enum';
import { UserInterfaceActive } from 'src/common/interfaces/user-active.interface';

@Controller('evaluaciones')
@ApiTags('Evaluaciones')
export class EvaluacionesController {
  constructor(private readonly evaluacionesService: EvaluacionesService) {}

  @Post()
  create(@Body() createEvaluacioneDto: CreateEvaluacionDto) {
    return this.evaluacionesService.create(createEvaluacioneDto);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery):Promise<Paginated<Evaluacion>> {
    return this.evaluacionesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evaluacionesService.findOne(+id);
  }

  @Post("/iniciarRegistros")
  iniciarRegistros(@Body() iniciarRegistrosDto: IniciarRegistrosDto) {
    return this.evaluacionesService.iniciarRecordEvaluacion(iniciarRegistrosDto);
  }

  @Post('/changeScore')
  @Auth(EnumRoles.DOCENTE)
  cambiarValorEvaluacion(@Body()changeEvaluacionDto:ChangeEvaluacionDto, @ActiveUser() user:UserInterfaceActive) {
    console.log(changeEvaluacionDto);
    return this.evaluacionesService.cambiarValorEvaluacion(changeEvaluacionDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evaluacionesService.remove(+id);
  }
}
