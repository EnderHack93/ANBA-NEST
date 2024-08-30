import { IsDateString, IsEmail, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreateDocenteDto {

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
  id_especialidad?:string
}
