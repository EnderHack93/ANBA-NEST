import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RequestWithUser } from './interfaces/requestLogin.interface';
import { EnumRoles } from '../common/enums/roles.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorators';
import { UserInterfaceActive } from 'src/common/interfaces/user-active.interface';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh.dto';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refreshToken(@Body() refreshToken:RefreshTokenDto){
    return this.authService.refreshTokens(refreshToken);
  }

  @Get('check')
  @Auth(EnumRoles.ESTUDIANTE,EnumRoles.DOCENTE)
  check(
    @ActiveUser() user:UserInterfaceActive
  ) {
    return user;
  }
}
