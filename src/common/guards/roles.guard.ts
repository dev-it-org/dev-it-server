import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  mixin,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '@prisma/client'
import { Request } from 'express'

import { UsersService } from 'src/modules/users'

export const RolesGuard = (roles: Role[]) => {
  class RolesGuardMixin implements CanActivate {
    constructor(
      public reflector: Reflector,
      @Inject(UsersService) public usersService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      try {
        if (!roles) return true

        const req: Request = await context.switchToHttp().getRequest()

        const user = await this.usersService.findUniqueDefault(
          'id',
          Number(req.user['sub']),
        )

        return roles.includes(user.role)
      } catch {
        throw new HttpException(
          {
            message: 'Access forbidden',
          },
          HttpStatus.FORBIDDEN,
        )
      }
    }
  }

  return mixin(RolesGuardMixin)
}
