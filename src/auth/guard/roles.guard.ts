import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { EnumRoles } from '../../common/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  //Obtener los roles requeridos de la ruta
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<EnumRoles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // Si no hay roles requeridos, permitir el acceso (rutas públicas o comunes)
    if (!requiredRoles) {
      return true;
    }

    // Obtener el usuario de la solicitud
    const { user } = context.switchToHttp().getRequest();

    // Permitir acceso completo al rol de ADMINISTRADOR
    if (user?.rol === EnumRoles.ADMIN) {
      return true;
    }

    // Verificar si el rol del usuario está en la lista de roles requeridos
    return requiredRoles.includes(user?.rol);
  }
}
