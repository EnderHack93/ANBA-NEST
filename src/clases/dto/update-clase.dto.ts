import { PartialType } from '@nestjs/swagger';
import { CreateClaseDto } from './create-clase.dto';

export class UpdateClaseDto extends PartialType(CreateClaseDto) {
    horaInicio?: string;
    horaFin?: string;
}
