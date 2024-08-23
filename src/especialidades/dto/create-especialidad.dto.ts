import { IsString, MinLength } from "class-validator";

export class CreateEspecialidadDto {

  @IsString()
  @MinLength(4)
  nombre: string;
}
