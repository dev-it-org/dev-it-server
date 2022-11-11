import { T_AccessToken, T_RefreshToken } from 'src/models/tokens.model'

export type T_AuthBody = {
  message: string
  access_token: T_AccessToken
  refresh_token: T_RefreshToken
}
