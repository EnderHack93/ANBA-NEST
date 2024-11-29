import { IsNumber, IsString } from "class-validator";

export class EstudiantePredictionDto{
    @IsNumber()
    edad:number = 0;
    
}