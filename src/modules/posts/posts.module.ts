import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { UsersService } from '../users'

import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'

@Module({
  imports: [HttpModule],
  controllers: [PostsController],
  providers: [PostsService, UsersService],
})
export class PostsModule {}
