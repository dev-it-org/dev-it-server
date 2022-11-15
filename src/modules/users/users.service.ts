import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Role, User } from '@prisma/client'
import * as argon2 from 'argon2'

import { PrismaService } from '../prisma'

import {
  T_User,
  T_UserCreateData,
  T_UserDeleteData,
  T_UserUpdateData,
} from './models'
import { CreateUserDto, UpdateUserDto } from './dto'

import { T_UserFindParam, T_UserFindType } from 'src/models/users.model'
import { I_GetData } from 'src/models/app.model'

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUsers(): Promise<I_GetData<{ users: T_User[]; count: number }>> {
    const users = await this.findMany()

    return {
      message: 'Successfully fetched users',
      data: {
        users,
        count: users.length,
      },
      timestamp: new Date(),
    }
  }

  async getUser(userId: number): Promise<I_GetData<{ user: T_User }>> {
    await this.checkNotExists('id', userId)

    const user = await this.findUnique('id', Number(userId))

    return {
      message: 'Successfully fetched user',
      data: {
        user,
      },
      timestamp: new Date(),
    }
  }

  async updateUser(
    userId: number,
    body: UpdateUserDto,
  ): Promise<I_GetData<Omit<T_User, 'created_at' | 'updated_at'>>> {
    await this.checkNotExists('id', userId)

    if (!Object.values(Role).includes(body.role))
      throw new ForbiddenException('Incorrect role')

    const user = await this.update({
      type: 'id',
      param: userId,
      userData: body,
    })

    return {
      message: 'Successfully updated user',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      timestamp: new Date(),
    }
  }

  async createUser(
    body: CreateUserDto,
  ): Promise<I_GetData<Omit<T_User, 'created_at' | 'updated_at'>>> {
    await this.checkExists('email', body.email)

    const hashedPassword = await argon2.hash(body.password)

    const user = await this.create({
      email: body.email,
      username: body.username,
      hash: hashedPassword,
    })

    return {
      message: 'Successfully created user',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      timestamp: new Date(),
    }
  }

  async deleteUser(
    localId: number,
    userId: number,
  ): Promise<Omit<I_GetData<unknown>, 'data'>> {
    await this.checkNotExists('id', userId)
    await this.delete({
      type: 'id',
      param: userId,
      userId: localId,
    })

    return {
      message: `Successfully deleted user with id: ${userId}`,
      timestamp: new Date(),
    }
  }

  async findMany(): Promise<T_User[]> {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    })
  }

  async findUnique(
    type: T_UserFindType,
    param: T_UserFindParam,
  ): Promise<T_User> {
    return await this.prismaService.user.findUnique({
      where: {
        [type]: param,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    })
  }

  async findUniqueDefault(
    type: T_UserFindType,
    param: T_UserFindParam,
  ): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        [type]: param,
      },
    })
  }

  async update(data: T_UserUpdateData): Promise<T_User> {
    const { type, param, userData } = data

    return await this.prismaService.user.update({
      where: {
        [type]: param,
      },
      data: userData,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    })
  }

  async create(data: T_UserCreateData): Promise<T_User> {
    const { email, username, hash } = data

    return await this.prismaService.user.create({
      data: {
        email,
        username,
        hash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    })
  }

  async delete(data: T_UserDeleteData) {
    try {
      const { type, param, userId } = data

      if (userId === param)
        throw new ForbiddenException('Can not be deleted while use it by yourself')

      await this.prismaService.user.delete({
        where: {
          [type]: param,
        },
      })
    } catch (error) {
      throw new ForbiddenException(error.response)
    }
  }

  async checkNotExists(type: T_UserFindType, param: T_UserFindParam) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          [type]: param,
        },
      })

      if (!user)
        throw new NotFoundException(`User with ${type}: ${param} not found`)
    } catch (error) {
      throw new ForbiddenException(error.response)
    }
  }

  async checkExists(type: T_UserFindType, param: T_UserFindParam) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          [type]: param,
        },
      })

      if (user)
        throw new ForbiddenException(
          `User with ${type}: ${param} already exists`,
        )
    } catch (error) {
      throw new ForbiddenException(error.response)
    }
  }
}
