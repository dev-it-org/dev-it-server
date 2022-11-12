import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '../prisma'

import { CreatePostDto, UpdatePostDto } from './dto'
import { T_Post } from './models'

import { I_GetData } from 'src/models/app.model'

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}

  async getPosts(): Promise<I_GetData<{ posts: T_Post[]; count: number }>> {
    return
  }

  async getPost(postId: number): Promise<I_GetData<{ post: T_Post }>> {
    return
  }

  async updatePost(
    postId: number,
    body: UpdatePostDto,
  ): Promise<I_GetData<Omit<T_Post, 'created_at' | 'updated_at'>>> {
    return
  }

  async createPost(
    body: CreatePostDto,
  ): Promise<I_GetData<Omit<T_Post, 'created_at' | 'updated_at'>>> {
    return
  }

  async deletePost(postId: number): Promise<Omit<I_GetData<unknown>, 'data'>> {
    return
  }
}
