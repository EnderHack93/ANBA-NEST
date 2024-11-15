import { Controller, Get, Param, Post, Body, Req, Patch } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { Request } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { EnumRoles } from 'src/common/enums/roles.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorators';
import { UserInterfaceActive } from 'src/common/interfaces/user-active.interface';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateRegistroAsistenciaDto } from './dto/create-registro-asistencia.dto';
import { EnumAsistencia } from './enums/asistencia.enum';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';

@ApiTags("Asistencias")
@Controller('asistencias')
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

  @Get()
  @Auth(EnumRoles.DOCENTE)
  @ApiBearerAuth()
  findAllByDocente(@Paginate() query:PaginateQuery, @ActiveUser() user:UserInterfaceActive) {
    const docenteId = user.id; // Asegúrate de que el ID del docente está en el token
    return this.asistenciaService.findByDocente(query,docenteId);
  }

  @Post('marcar')
  marcarAsistencia(@Body() createAsistenciaDto: CreateAsistenciaDto) {
    return this.asistenciaService.marcarAsistencia(createAsistenciaDto);
  }

  @Patch(':id')
  updateAsistencia(@Param('id') id_asistencia: number ,@Body() updateAsistenciaDto: UpdateAsistenciaDto) {
    return this.asistenciaService.cambiarEstadoAsistencia(id_asistencia,updateAsistenciaDto) // Asegúrate de que el ID del doc
  }
  
  @Post('iniciarRegistroAsistencia')
  iniciarRegistroAsistencia(@Body() createRegistroAsistencia: CreateRegistroAsistenciaDto) {
    return this.asistenciaService.iniciarRegistroAsistencia(createRegistroAsistencia);
    }
}
