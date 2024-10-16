import { Transform } from "class-transformer";
import { IsDateString, IsEmail, IsNumber, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreateDocenteDto {

  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsString()
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
  id_especialidad:number
}
