import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { error } from 'src/common/constants/error-messages';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get<string[]>(META_ROLES, ctx.getHandler())
    if(!validRoles || validRoles.length === 0) {
      return true
    }
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if(!user) {
      throw new InternalServerErrorException(error.USER_NOT_FOUND)
    }
    if(!validRoles.includes(user.role.name)) {
      throw new ForbiddenException(error.USER_WITHOUT_ACCESS)
    }
    return true;
    

  }
}
