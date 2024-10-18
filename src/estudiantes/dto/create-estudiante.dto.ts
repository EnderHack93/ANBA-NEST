import { Transform } from 'class-transformer';
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
  @IsString({
    message: 'El nombre debe ser una cadena de texto valida'
  })
  nombres: string;

  @IsString({
    message: 'El apellido debe ser una cadena de texto valida'
  })
  apellidos: string;

  @IsString({
    message: 'El carnet debe ser una cadena de texto valida'
  })
  carnet: string;

  @IsEmail()
  correo: string;

  @IsStrongPassword()
  @Transform(({ value }) => value.trim())
  password: string;

  @IsDateString()
  fecha_nacimiento: Date;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsNumber()
  id_especialidad: number;
}
