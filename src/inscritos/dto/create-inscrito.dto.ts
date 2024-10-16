import { IsDate, IsDateString, IsNumber, IsString } from "class-validator";

export class CreateInscritoDto {
  @IsDateString()
  fecha_inscripcion: Date

  @IsString()
  id_estudiante:string

  @IsNumber()
  id_clase:number
}
