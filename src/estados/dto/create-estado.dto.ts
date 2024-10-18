import { IsString, IsNotEmpty } from 'class-validator';
import { EnumEstados } from 'src/common/enums/estados.enum';

export class CreateEstadoDto {
  @IsString()
  @IsNotEmpty()
  nombre: EnumEstados;
}
