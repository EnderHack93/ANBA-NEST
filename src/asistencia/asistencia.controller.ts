import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { Request } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { EnumRoles } from 'src/common/enums/roles.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorators';
import { UserInterfaceActive } from 'src/common/interfaces/user-active.interface';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';

@Controller('asistencias')
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

  @Get()
  @Auth(EnumRoles.DOCENTE)
  findAllByDocente(@ActiveUser() user:UserInterfaceActive) {
    const docenteId = user.username; // Asegúrate de que el ID del docente está en el token
    return this.asistenciaService.findByDocente(docenteId);
  }

  @Post('marcar')
  marcarAsistencia(@Body() createAsistenciaDto: CreateAsistenciaDto) {
    return this.asistenciaService.marcarAsistencia(createAsistenciaDto);
  }
}
