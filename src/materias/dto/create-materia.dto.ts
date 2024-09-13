import { IsString } from "class-validator";

export class CreateMateriaDto {
  @IsString()
  nombre: string;

  @IsString()
  semestre: string;

  @IsString()
  descripcion: string;

  @IsString()
  id_especialidad: string;
}
