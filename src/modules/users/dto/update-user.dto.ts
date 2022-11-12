import { Role } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  username: string

  @ApiProperty({ enum: Role })
  @IsOptional()
  role: Role
}
