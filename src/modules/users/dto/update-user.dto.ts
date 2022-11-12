import { Role } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty({ default: 'test' })
  @IsOptional()
  @IsString()
  username: string

  @ApiProperty({ enum: Role })
  @IsOptional()
  role: Role
}
