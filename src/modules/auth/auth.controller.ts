import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

import { AuthService } from './auth.service'
import { SignInDto, SignUpDto } from './dto'

import { I_GetData } from 'src/models/app.model'
import { T_Tokens } from 'src/models/tokens.model'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Signed up',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  signUp(@Body() dto: SignUpDto): Promise<I_GetData<T_Tokens>> {
    return this.authService.signUp(dto)
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signed in',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  signIn(@Body() dto: SignInDto): Promise<I_GetData<T_Tokens>> {
    return this.authService.signIn(dto)
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens refreshed',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  refreshTokens(@Req() req: Request): Promise<I_GetData<T_Tokens>> {
    const user = req.user
    return this.authService.refreshTokens(user['email'], user['refreshToken'])
  }
}
