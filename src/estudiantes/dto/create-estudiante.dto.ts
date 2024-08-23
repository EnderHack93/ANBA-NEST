import { IsDate, IsDateString, IsEmail, IsNumber, IsOptional, IsPositive, IsString, IsStrongPassword, MinLength } from 'class-validator';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';

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

  @IsString()
  @IsOptional()
  id_especialidad:string
  
}
