import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { CreateEstadoDto } from './create-estado.dto';

export class UpdateEstadoDto extends PartialType(CreateEstadoDto) {
}
