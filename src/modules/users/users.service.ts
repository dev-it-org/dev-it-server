import { ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma'

import { T_FindType, T_User } from './models'

export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findUnique(type: T_FindType, param: number | string): Promise<T_User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        [type]: param,
      },
    })

    if (!user)
      throw new ForbiddenException(`User with ${type}: ${param} not found `)

    return user
  }
}
