import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'

import { PrismaService } from '../prisma'
import { UsersService } from '../users'

import { SignInDto, SignUpDto } from './dto'

import { T_Tokens } from 'src/models/tokens.model'
import { I_GetData } from 'src/models/app.model'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(dto: SignUpDto): Promise<I_GetData<T_Tokens>> {
    const userExists = await this.usersService.findUnique('email', dto.email)

    if (userExists)
      throw new ForbiddenException(
        `User with email: ${dto.email} already exists`,
      )

    const hashedPassword = await argon2.hash(dto.password)

    const user = await this.usersService.create({
      email: dto.email,
      username: dto.username,
      hash: hashedPassword,
    })

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return {
      message: 'Successfully signed up',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      timestamp: new Date(),
    }
  }

  async signIn(dto: SignInDto): Promise<I_GetData<T_Tokens>> {
    const user = await this.usersService.findUniqueDefault('email', dto.email)

    if (!user)
      throw new ForbiddenException(`User with email ${dto.email} not found`)

    const passwordMatches = await argon2.verify(user.hash, dto.password)

    if (!passwordMatches) throw new ForbiddenException('Incorrect password')

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return {
      message: 'Successfully signed in',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      timestamp: new Date(),
    }
  }

  async refreshTokens(email: string, rt: string): Promise<I_GetData<T_Tokens>> {
    try {
      const user = await this.usersService.findUniqueDefault('email', email)

      if (!user) throw new ForbiddenException('Incorrect data')

      const refreshTokenMatches = await argon2.verify(user.hashedRt, rt)

      if (!refreshTokenMatches)
        throw new ForbiddenException('Incorrect refresh token')

      const tokens = await this.getTokens(user.id, user.email)
      await this.updateRefreshToken(user.id, tokens.refreshToken)

      return {
        message: 'Successfully refreshed tokens',
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        timestamp: new Date(),
      }
    } catch {
      throw new NotFoundException('Refresh token expired')
    }
  }

  async getTokens(userId: number, email: string): Promise<T_Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN'),
          expiresIn: 60 * 60 * 24 * 2,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ])

    return {
      accessToken: at,
      refreshToken: rt,
    }
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hash = await argon2.hash(refreshToken)
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    })
  }
}
