import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'

import {
  AuthModule,
  InfoModule,
  PostsModule,
  PrismaModule,
  UsersModule,
} from './modules'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    InfoModule,
    PostsModule,
    UsersModule,
  ],
})
export class AppModule {}
