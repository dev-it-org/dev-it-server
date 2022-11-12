import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ChangeMyPasswordDto {
  @ApiProperty({ default: 'Prev value' })
  @IsNotEmpty()
  @IsString()
  previousPassword: string

  @ApiProperty({ default: 'New value' })
  @IsNotEmpty()
  @IsString()
  newPassword: string
}
