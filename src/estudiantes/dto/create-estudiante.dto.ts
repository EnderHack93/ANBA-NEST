import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateEstudianteDto {
  @IsString()
  @MinLength(5)
  nombres: string;

  @IsString()
  apellidos: string;

  @IsString()
  carnet: string;

  @IsEmail()
  correo: string;

  @IsStrongPassword()
  password: string;

  @IsDateString()
  fecha_nacimiento: Date;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsNumber()
  @IsOptional()
  id_especialidad?: number;
}
