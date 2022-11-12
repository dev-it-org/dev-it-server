import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

import { T_User } from '../users/models'

import { InfoService } from './info.service'

import { I_GetData } from 'src/models/app.model'

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('info')
@ApiTags('Info')
export class InfoController {
  constructor(private infoService: InfoService) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User data fetched',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getMe(@Req() req: Request): Promise<I_GetData<T_User>> {
    const user = req.user
    return this.infoService.getMeAuthorized(Number(user['sub']))
  }
}
