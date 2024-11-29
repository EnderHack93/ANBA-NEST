import { PartialType } from '@nestjs/swagger';
import { CreateCuadroDeMandoDto } from './create-cuadro_de_mando.dto';

export class UpdateCuadroDeMandoDto extends PartialType(CreateCuadroDeMandoDto) {}
