import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Transform(({ value }) => value.trim())
  password: string;

  @IsBoolean()
  remember: boolean;
}