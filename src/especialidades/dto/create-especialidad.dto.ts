import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateEspecialidadDto {

  @IsString()
  @MinLength(4)
  nombre: string;

  @IsNumber()
  @IsOptional()
  duracion?: number;
}
