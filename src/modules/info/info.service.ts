import { Injectable, ForbiddenException } from '@nestjs/common'
import * as argon2 from 'argon2'

import { UsersService } from '../users'
import { T_User } from '../users/models'
import { PrismaService } from '../prisma'

import { ChangeMyPasswordDto } from './dto'

import { I_GetData } from 'src/models/app.model'

@Injectable()
export class InfoService {
  constructor(
    private usersService: UsersService,
    private prismaService: PrismaService,
  ) {}

  async getMyProfile(userId: number): Promise<I_GetData<T_User>> {
    const user = await this.usersService.findUnique('id', userId)

    return {
      message: 'Successfully fetched',
      data: user,
      timestamp: new Date(),
    }
  }

  async changeMyPassword(
    userId: number,
    body: ChangeMyPasswordDto,
  ): Promise<Omit<I_GetData<unknown>, 'data'>> {
    const user = await this.usersService.findUniqueDefault('id', userId)

    const passwordMatches = await argon2.verify(
      user.hash,
      body.previousPassword,
    )

    if (!passwordMatches) throw new ForbiddenException('Incorrect password')

    const hashedPassword = await argon2.hash(body.newPassword)

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hash: hashedPassword,
      },
    })

    return {
      message: 'Successfully updated',
      timestamp: new Date(),
    }
  }
}
