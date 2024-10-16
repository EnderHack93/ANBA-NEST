import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEstadoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
