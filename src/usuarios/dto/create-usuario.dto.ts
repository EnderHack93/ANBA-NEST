import { IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { EnumRoles } from 'src/common/enums/roles.enum';

export class CreateUsuarioDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  @IsOptional()
  rol: EnumRoles;
}
