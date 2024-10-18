import { IsNumber, IsString } from "class-validator";

export class CreateMateriaDto {
  @IsString()
  nombre: string;

  @IsNumber()
  id_semestre: number;

  @IsString()
  descripcion: string;

  @IsNumber()
  id_especialidad: number;
}
