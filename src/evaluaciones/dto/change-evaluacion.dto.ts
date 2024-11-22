import { PartialType } from '@nestjs/swagger';
import { CreateEvaluacionDto } from './create-evaluacion.dto';
import { IsNumber } from 'class-validator';

export class ChangeEvaluacionDto {
    @IsNumber()
    id_evaluacion: number

    @IsNumber()
    nuevaNota: number
}
