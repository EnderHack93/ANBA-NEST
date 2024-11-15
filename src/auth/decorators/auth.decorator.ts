import { applyDecorators, UseGuards } from '@nestjs/common';
import { EnumRoles } from '../../common/enums/roles.enum';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from './roles.decorator';

export function Auth(...role: EnumRoles[]) {
  return applyDecorators(UseGuards(AuthGuard, RolesGuard), Roles(...role));
}
