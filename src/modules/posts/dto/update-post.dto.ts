import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdatePostDto {
  @ApiProperty({ default: 'New Title' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
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
