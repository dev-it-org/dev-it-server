import { Injectable } from '@nestjs/common'

import { UsersService } from '../users'
import { T_User } from '../users/models'

import { I_GetData } from 'src/models/app.model'

@Injectable()
export class InfoService {
  constructor(private usersService: UsersService) {}

  async getMeAuthorized(userId: number): Promise<I_GetData<T_User>> {
    const user = await this.usersService.findUnique('id', userId)

    return {
      message: 'Successfully fetched',
      data: user,
      timestamp: new Date(),
    }
  }
}
