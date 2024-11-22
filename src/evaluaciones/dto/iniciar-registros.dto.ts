import { IsEnum, IsNumber } from "class-validator";
import { EnumTiposEvaluacion } from "src/common/enums/tipos-evaluaciones";

export class IniciarRegistrosDto{
    @IsNumber()
    id_clase:number;

    @IsEnum(EnumTiposEvaluacion)
    tipo_evaluacion:EnumTiposEvaluacion
}