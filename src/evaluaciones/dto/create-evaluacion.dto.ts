import { IsNumber, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateEvaluacionDto {
  @IsString()
  @IsNotEmpty()
  id_estudiante: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  id_clase: number;

  @IsNumber()
  @IsNotEmpty()
  nota: number;
}
