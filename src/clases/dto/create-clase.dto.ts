import { IsEnum, IsNumber, IsString } from "class-validator";
import { estado, horarios } from "../entities/clase.enum";

export class CreateClaseDto {

  @IsString()
  nombre: string;

  @IsNumber()
  capacidad_max: number;

  @IsEnum(horarios)
  horario:horarios;

  @IsString()
  aula:string

  @IsString()
  gestion:string

  @IsNumber()
  id_materia:number

  @IsString()
  id_docente:string

}
