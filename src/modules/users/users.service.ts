import { ForbiddenException, Injectable } from '@nestjs/common'
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

  async getUsersAuthorized(
    email: string,
  ): Promise<I_GetData<{ users: T_User[]; count: number }>> {
    await this.checkRole('email', email)

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

  async getUserAuthorized(
    email: string,
    userId: number,
  ): Promise<I_GetData<{ user: T_User }>> {
    await this.checkRole('email', email)
    await this.checkExists('id', userId)

    const user = await this.findUnique('id', Number(userId))

    return {
      message: 'Successfully fetched user',
      data: {
        user,
      },
      timestamp: new Date(),
    }
  }

  async updateUserAuthorized(
    email: string,
    userId: number,
    body: UpdateUserDto,
  ): Promise<I_GetData<{ user: T_User }>> {
    await this.checkRole('email', email)
    await this.checkExists('id', userId)

    const user = await this.update({
      type: 'email',
      param: email,
      userData: body,
    })

    return {
      message: 'Successfully updated user',
      data: {
        user,
      },
      timestamp: new Date(),
    }
  }

  async createUserAuthorized(
    email: string,
    body: CreateUserDto,
  ): Promise<I_GetData<{ user: T_User }>> {
    await this.checkRole('email', email)

    const hashedPassword = await argon2.hash(body.password)

    const user = await this.create({
      email: body.email,
      username: body.username,
      hash: hashedPassword,
    })

    return {
      message: 'Successfully created user',
      data: {
        user,
      },
      timestamp: new Date(),
    }
  }

  async deleteUserAuthorized(
    email: string,
    userId: number,
  ): Promise<Omit<I_GetData<unknown>, 'data'>> {
    await this.checkRole('email', email)
    await this.checkExists('id', userId)
    await this.delete({
      type: 'id',
      param: userId,
      email,
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
    const { type, param, email } = data

    const user = await this.findUnique('email', email)

    if (user.id === param)
      throw new ForbiddenException('Can not be deleted while authorized')

    await this.prismaService.user.delete({
      where: {
        [type]: param,
      },
    })
  }

  async checkRole(type: T_UserFindType, param: T_UserFindParam) {
    const user = await this.prismaService.user.findUnique({
      where: {
        [type]: param,
      },
    })

    if (user.role === Role.User) throw new ForbiddenException(`Forbidden`)

    return
  }

  async checkExists(type: T_UserFindType, param: T_UserFindParam) {
    const user = await this.prismaService.user.findUnique({
      where: {
        [type]: param,
      },
    })

    if (!user)
      throw new ForbiddenException(`User with ${type}: ${param} not found`)

    return
  }
}
