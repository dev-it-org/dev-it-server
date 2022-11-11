import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@Controller('info')
@ApiTags('Posts')
export class InfoController {}
