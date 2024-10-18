import { IsDateString, IsString } from "class-validator";

export class CreateSemestreDto {
    @IsString()
    nombre: string

    @IsString()
    gestion: string
    
    @IsDateString()
    fecha_inicio: Date
    
    @IsDateString()
    fecha_fin: Date


    

}
