import { IsEnum, IsNumber, IsString } from "class-validator";
import { EnumTiposEvaluacion } from "src/common/enums/tipos-evaluaciones";

export class ConfirmarEvaluacionDto{

    @IsNumber()
    id_clase: number

    @IsEnum(EnumTiposEvaluacion)
    tipo_evaluacion: EnumTiposEvaluacion
}