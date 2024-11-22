import { ArrayNotEmpty, IsArray, IsEnum, IsNumber, IsString } from "class-validator";
import { EnumHorarios } from "src/common/enums/horarios.enum";

export class CreateClaseDto {

  @IsString()
  nombre: string;

  @IsNumber()
  capacidad_max: number;

  @IsEnum(EnumHorarios)
  horario:EnumHorarios;

  @IsArray()
  @ArrayNotEmpty()
  dias: string[];

  @IsString()
  aula:string

  @IsNumber()
  id_materia:number

  @IsString()
  id_docente:string

}
