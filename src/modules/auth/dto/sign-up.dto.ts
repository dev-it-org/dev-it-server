import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class SignUpDto {
  @ApiProperty({ default: 'test@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ default: 'test' })
  @IsOptional()
  @IsString()
  username: string

  @ApiProperty({ default: 'test' })
  @IsString()
  @IsNotEmpty()
  password: string
}
