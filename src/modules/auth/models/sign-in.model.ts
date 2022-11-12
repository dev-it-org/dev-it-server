import { Role } from '@prisma/client'

import { T_Tokens } from 'src/models/tokens.model'

export interface I_SignInResponse extends T_Tokens {
  id: number
  email: string
  username: string
  role: Role
}
