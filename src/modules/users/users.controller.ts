import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

import { CreateUserDto, UpdateUserDto } from './dto'
import { UsersService } from './users.service'
import { T_User } from './models'

import { I_GetData } from 'src/models/app.model'

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getUsers(
    @Req() req: Request,
  ): Promise<I_GetData<{ users: T_User[]; count: number }>> {
    const user = req.user
    return this.usersService.getUsersAuthorized(user['email'])
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getUser(
    @Req() req: Request,
    @Param('userId') userId: string,
  ): Promise<I_GetData<{ user: T_User }>> {
    const user = req.user
    return this.usersService.getUserAuthorized(user['email'], Number(userId))
  }

  @Put(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  updateUser(
    @Req() req: Request,
    @Body() body: UpdateUserDto,
    @Param('userId') userId: string,
  ): Promise<I_GetData<{ user: T_User }>> {
    const user = req.user
    return this.usersService.updateUserAuthorized(
      user['email'],
      Number(userId),
      body,
    )
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  createUser(
    @Req() req: Request,
    @Body() body: CreateUserDto,
  ): Promise<I_GetData<{ user: T_User }>> {
    const user = req.user
    return this.usersService.createUserAuthorized(user['email'], body)
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  deleteUser(
    @Req() req: Request,
    @Param('userId') userId: string,
  ): Promise<Omit<I_GetData<unknown>, 'data'>> {
    const user = req.user
    return this.usersService.deleteUserAuthorized(user['email'], Number(userId))
  }
}
