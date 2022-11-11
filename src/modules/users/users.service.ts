import { ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma'

import { T_User, T_UserCreateData } from './models'

import { T_UserFindParam, T_UserFindType } from 'src/models/users.model'

export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findUnique(
    type: T_UserFindType,
    param: T_UserFindParam,
  ): Promise<T_User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        [type]: param,
      },
    })

    if (!user)
      throw new ForbiddenException(`User with ${type}: ${param} not found `)

    return user
  }

  async create(data: T_UserCreateData): Promise<T_User> {
    const { email, username, hash } = data

    return await this.prismaService.user.create({
      data: {
        email,
        username,
        hash,
      },
    })
  }
}
