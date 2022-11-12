import { User } from '@prisma/client'

import { UpdateUserDto } from '../dto'

import { T_UserFindParam, T_UserFindType } from 'src/models/users.model'

export type T_User = Omit<User, 'hash' | 'hashedRt'>

export type T_UserUpdateData = {
  type: T_UserFindType
  param: T_UserFindParam
  userData: UpdateUserDto
}

export type T_UserCreateData = {
  email: string
  username: string
  hash: string
}

export type T_UserDeleteData = {
  type: T_UserFindType
  param: T_UserFindParam
  userId: number
}
