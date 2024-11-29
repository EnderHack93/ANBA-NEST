import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CuadroDeMandoService } from './cuadro_de_mando.service';
import { CreateCuadroDeMandoDto } from './dto/create-cuadro_de_mando.dto';
import { UpdateCuadroDeMandoDto } from './dto/update-cuadro_de_mando.dto';
import { ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@ApiTags('cuadro-de-mando')
@Controller('cuadro-de-mando')
export class CuadroDeMandoController {
  constructor(private readonly cuadroDeMandoService: CuadroDeMandoService) {}

  @Post('predict')
  async predecirEstado(@Body() datos: any): Promise<any> {
    return this.cuadroDeMandoService.obtenerPrediccion(datos);
  }

  @Get('estadoEstudiantes')
  async obtenerEstadoEstudiantes(@Paginate() query:PaginateQuery) {
    return this.cuadroDeMandoService.bulkPredict(query);
  }

  @Get('crecimientoEstudiantes')
  async obtenerCrecimientoEstudiantes() {
    return this.cuadroDeMandoService.getCrecimientoEstudiantes();
  }

  @Get('rendimiento/general')
  async getRendimientoGeneral() {
    return this.cuadroDeMandoService.getRendimientoGeneral();
  }

  @Get('asistencia/fecha')
  async getAsistenciaPorFecha(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.cuadroDeMandoService.getAsistenciaPorFecha(startDate, endDate);
  }
}
