import { ApiProperty, PartialType } from '@nestjs/swagger';
import { EnumAsistencia } from '../enums/asistencia.enum';
import { IsEnum, IsNumber } from 'class-validator';

export class UpdateAsistenciaDto {

  @ApiProperty()
  @IsEnum(EnumAsistencia)
  nuevoEstado: EnumAsistencia;
}
