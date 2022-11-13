import { Post } from '@prisma/client'

export enum E_OrderBy {
  asc = 'asc',
  desc = 'desc',
}

export type T_Post = Post

export type T_PostUpdateData = {
  title: string
  description: string
  link: string
}

export type T_PostCreateData = {
  title: string
  description: string
  link: string
}

type T_FetchResponseText<T> = {
  _attributes: T
  _text: string
}

type T_FetchResponseTextOmitted = Omit<
  T_FetchResponseText<unknown>,
  '_attributes'
>

export interface I_FetchResponse {
  title: T_FetchResponseTextOmitted
  description: T_FetchResponseTextOmitted
  link: T_FetchResponseTextOmitted
}
