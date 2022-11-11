import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { UsersService } from '../users'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies'

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
