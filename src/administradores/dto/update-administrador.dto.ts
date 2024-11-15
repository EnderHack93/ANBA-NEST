import { PartialType } from '@nestjs/swagger';
import { CreateAdministradorDto } from './create-administrador.dto';

export class UpdateAdministradoreDto extends PartialType(CreateAdministradorDto) {}
