import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'

import { PrismaService } from '../prisma'
import { UsersService } from '../users'

import { SignInDto, SignUpDto } from './dto'
import { I_SignInResponse, I_SignUpResponse } from './models'

import { T_Tokens } from 'src/models/tokens.model'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(dto: SignUpDto): Promise<I_SignUpResponse> {
    const userExists = await this.usersService.findUnique('email', dto.email)

    if (!userExists)
      throw new ForbiddenException(`User with email: ${dto.email} not found `)

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
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    }
  }

  async signIn(dto: SignInDto): Promise<I_SignInResponse> {
    return {
      message: '',
      access_token: '',
      refresh_token: '',
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
