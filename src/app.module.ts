import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {
  AuthModule,
  InfoModule,
  PostsModule,
  PrismaModule,
  UsersModule,
} from './modules'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    InfoModule,
    PostsModule,
    UsersModule,
  ],
})
export class AppModule {}
