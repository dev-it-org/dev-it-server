import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaModule } from './modules'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env.example' }),
    PrismaModule,
  ],
})
export class AppModule {}
