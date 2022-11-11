import { ForbiddenException, Injectable } from '@nestjs/common'

import { UsersService } from '../users'
import { T_FindType, T_User } from '../users/models'

import { SignInDto, SignUpDto } from './dto'
import { T_SignInResponse, T_SignUpResponse } from './models'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(dto: SignUpDto): Promise<T_SignUpResponse> {
    const user = await this.userExists('email', dto.email)

    return {
      message: 'Successfully signed up',
      access_token: '',
      refresh_token: '',
    }
  }

  async signIn(dto: SignInDto): Promise<T_SignInResponse> {
    const user = await this.userExists('email', dto.email)

    return {
      message: 'Successfully signed in',
      access_token: '',
      refresh_token: '',
    }
  }

  async userExists(type: T_FindType, email: string): Promise<T_User> {
    const user = await this.usersService.findUnique(type, email)

    if (!user)
      throw new ForbiddenException(`User with ${type}: ${email} not found `)

    return user
  }
}
