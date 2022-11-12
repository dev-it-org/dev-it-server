import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ default: 'test@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ default: 'test' })
  @IsOptional()
  @IsString()
  username: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string
}
