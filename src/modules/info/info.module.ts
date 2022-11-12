import { Module } from '@nestjs/common'

import { UsersService } from '../users'

import { InfoController } from './info.controller'
import { InfoService } from './info.service'

@Module({
  controllers: [InfoController],
  providers: [InfoService, UsersService],
})
export class InfoModule {}
