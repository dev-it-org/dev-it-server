import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreatePostDto {
  @ApiProperty({ default: 'New Title' })
  @IsString()
  title: string

  @ApiProperty({ default: 'New Description' })
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty({ default: 'New Link' })
  @IsOptional()
  @IsString()
  link: string
}
