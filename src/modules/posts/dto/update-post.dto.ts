import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdatePostDto {
  @ApiProperty({ default: 'New Title' })
  @IsOptional()
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
