import { IsNumber, IsString } from "class-validator";

export class CreateMateriaDto {
  @IsString()
  nombre: string;

  @IsString()
  semestre: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  id_especialidad: number;
}
