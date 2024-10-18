import { IsDateString, IsEnum, IsNumber, IsString } from "class-validator";
import { EnumAsistencia } from "../enums/asistencia.enum";

export class CreateAsistenciaDto {

    @IsNumber()
    id_clase:number

    @IsString()
    id_estudiante:string

    @IsDateString()
    fecha:Date

    @IsEnum(EnumAsistencia)
    asistio:EnumAsistencia
    
}
