import { T_Tokens } from 'src/models/tokens.model'

export type T_AuthBody = {
  message: string
  data: T_Tokens
  timestamp: Date
}
