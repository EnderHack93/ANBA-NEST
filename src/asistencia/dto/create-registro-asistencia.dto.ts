import { IsDateString, IsNumber } from "class-validator";

export class CreateRegistroAsistenciaDto {

    @IsNumber()
    id_clase:number

    @IsDateString()
    fecha:Date
    
}