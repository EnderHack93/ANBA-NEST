import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateAdministradorDto {
  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsEmail()
  correo: string;

  @IsDateString()
  fecha_nacimiento: Date;

  @IsString()
  carnet: string;

  @IsString()
  @IsOptional()
  telefono?: string;
}
