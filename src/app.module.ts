import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule, PrismaModule } from './modules'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env.example' }),
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}
