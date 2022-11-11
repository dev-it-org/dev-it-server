import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { SignInDto, SignUpDto } from './dto'
import { I_SignInResponse, I_SignUpResponse } from './models'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  signUp(@Body() dto: SignUpDto): Promise<I_SignUpResponse> {
    return this.authService.signUp(dto)
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  signIn(@Body() dto: SignInDto): Promise<I_SignInResponse> {
    return this.authService.signIn(dto)
  }
}
