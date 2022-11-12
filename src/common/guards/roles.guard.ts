import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  mixin,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '@prisma/client'
import { Request } from 'express'

export const RolesGuard = (roles: Role[]) => {
  class RolesGuardMixin implements CanActivate {
    constructor(public reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      try {
        if (!roles) return true

        const req: Request = await context.switchToHttp().getRequest()

        return roles.includes(req.user['role'])
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
