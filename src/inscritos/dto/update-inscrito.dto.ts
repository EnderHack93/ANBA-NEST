import { PartialType } from '@nestjs/swagger';
import { CreateInscritoDto } from './create-inscrito.dto';

export class UpdateInscritoDto extends PartialType(CreateInscritoDto) {}
