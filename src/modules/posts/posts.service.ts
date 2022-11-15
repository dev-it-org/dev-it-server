import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { HttpService } from '@nestjs/axios'
import * as convert from 'xml-js'

import { PrismaService } from '../prisma'

import { CreatePostDto, UpdatePostDto } from './dto'
import {
  E_OrderBy,
  I_FetchResponse,
  T_Post,
  T_PostCreateData,
  T_PostUpdateData,
} from './models'

import { I_GetData } from 'src/models/app.model'

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {
    this.fetchPosts()
  }

  @Cron(CronExpression.EVERY_HOUR)
  async fetchPosts() {
    const { data } = await this.httpService.axiosRef.get(
      'https://www.hltv.org/rss/news',
    )

    const convertedData = convert.xml2js(data, {
      compact: true,
    }) as any

    const result = convertedData.rss.channel.item as I_FetchResponse[]

    for (const item of result) {
      const post = await this.prismaService.post.findFirst({
        where: {
          OR: [
            { title: item.title._text },
            { description: item.description._text },
          ],
        },
      })
      if (!post) {
        await this.create({
          title: item.title._text,
          description: item.description._text,
          link: item.link._text,
        })
      }
    }
  }

  async getPosts(
    title: string,
    limit: number,
    page: number,
    sort: E_OrderBy,
  ): Promise<
    I_GetData<{
      posts: T_Post[]
      count: number
      total: number
      page: number
      limit: number
    }>
  > {
    const total = await this.prismaService.post.count()
    const posts = await this.findMany(title, limit, page, sort, total)

    return {
      message: 'Successfully fetched posts',
      data: {
        posts,
        count: posts.length,
        total,
        page,
        limit,
      },
      timestamp: new Date(),
    }
  }

  async getPost(postId: number): Promise<I_GetData<{ post: T_Post }>> {
    await this.checkNotExists(postId)
    const post = await this.findUnique(postId)

    return {
      message: 'Successfully fetched post',
      data: {
        post,
      },
      timestamp: new Date(),
    }
  }

  async updatePost(
    postId: number,
    body: UpdatePostDto,
  ): Promise<I_GetData<Omit<T_Post, 'created_at' | 'updated_at'>>> {
    await this.checkNotExists(postId)

    const post = await this.update(postId, body)

    return {
      message: 'Successfully updated post',
      data: {
        ...post,
      },
      timestamp: new Date(),
    }
  }

  async createPost(
    body: CreatePostDto,
  ): Promise<I_GetData<Omit<T_Post, 'created_at' | 'updated_at'>>> {
    const post = await this.create(body)

    return {
      message: 'Successfully created post',
      data: {
        ...post,
      },
      timestamp: new Date(),
    }
  }

  async deletePost(postId: number): Promise<Omit<I_GetData<unknown>, 'data'>> {
    await this.checkNotExists(postId)
    await this.delete(postId)

    return {
      message: 'Successfully deleted post',
      timestamp: new Date(),
    }
  }

  async findMany(
    title: string,
    limit: number,
    page: number,
    sort: E_OrderBy,
    total: number,
  ): Promise<T_Post[]> {
    if (isNaN(page)) {
      return await this.prismaService.post.findMany({
        take: !limit ? total : limit,
        where: {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        },
        orderBy: {
          title: sort,
        },
      })
    } else {
      return await this.prismaService.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        },
        orderBy: {
          title: sort,
        },
      })
    }
  }

  async findUnique(postId: number): Promise<T_Post> {
    return await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
    })
  }

  async update(postId: number, postData: T_PostUpdateData): Promise<T_Post> {
    return await this.prismaService.post.update({
      where: {
        id: postId,
      },
      data: {
        ...postData,
      },
    })
  }

  async create(postData: T_PostCreateData): Promise<T_Post> {
    return await this.prismaService.post.create({
      data: {
        ...postData,
      },
    })
  }

  async delete(postId: number): Promise<void> {
    await this.prismaService.post.delete({
      where: {
        id: postId,
      },
    })
  }

  async checkNotExists(postId: number) {
    try {
      const post = await this.prismaService.post.findUnique({
        where: {
          id: postId,
        },
      })

      if (!post)
        throw new NotFoundException(`Post with id: ${postId} not found`)
    } catch (error) {
      throw new ForbiddenException(error.response)
    }
  }
}
