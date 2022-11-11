import { User } from '@prisma/client'

export type T_UserCreateData = {
  email: string
  username: string
  hash: string
}

export type T_User = User
