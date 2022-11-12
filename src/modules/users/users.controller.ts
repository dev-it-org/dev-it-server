import { Role } from '@prisma/client'
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
import { RolesGuard } from 'src/common'

@UseGuards(AuthGuard('jwt'), RolesGuard([Role.Admin, Role.Moderator]))
@ApiBearerAuth()
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
  getUsers(): Promise<I_GetData<{ users: T_User[]; count: number }>> {
    return this.usersService.getUsers()
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
    @Param('userId') userId: string,
  ): Promise<I_GetData<{ user: T_User }>> {
    return this.usersService.getUser(Number(userId))
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
    @Body() body: UpdateUserDto,
    @Param('userId') userId: string,
  ): Promise<I_GetData<Omit<T_User, 'created_at' | 'updated_at'>>> {
    return this.usersService.updateUser(Number(userId), body)
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
    @Body() body: CreateUserDto,
  ): Promise<I_GetData<Omit<T_User, 'created_at' | 'updated_at'>>> {
    return this.usersService.createUser(body)
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
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
    return this.usersService.deleteUser(Number(user['sub']), Number(userId))
  }
}
