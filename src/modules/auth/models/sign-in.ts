import { T_AccessToken, T_RefreshToken } from 'src/models/tokens'

export type T_SignInResponse = {
  message: string
  access_token: T_AccessToken
  refresh_token: T_RefreshToken
}
