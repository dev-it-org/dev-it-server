import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  mixin,
  Inject,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '@prisma/client'

import { PrismaService } from 'src/modules/prisma'

export const RolesGuard = (roles: Role[]) => {
  class RolesGuardMixin implements CanActivate {
    constructor(
      public reflector: Reflector,
      @Inject(PrismaService)
      public prismaService: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      try {
        if (!roles) return true

        const { user } = await context.switchToHttp().getRequest()
        const { role } = await this.prismaService.user.findUnique({
          where: {
            id: user.id,
          },
        })
        console.log(role)

        return roles.includes(role)
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
