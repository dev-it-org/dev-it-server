import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { PostsService } from './posts.service'
import { T_Post } from './models'

import { I_GetData } from 'src/models/app.model'
import { CreatePostDto, UpdatePostDto } from './dto'

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Posts fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getPosts(): Promise<I_GetData<{ posts: T_Post[]; count: number }>> {
    return this.postsService.getPosts()
  }

  @Get(':postId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getPost(
    @Param('postId') postId: string,
  ): Promise<I_GetData<{ post: T_Post }>> {
    return this.postsService.getPost(Number(postId))
  }

  @Put(':postId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  updatePost(
    @Param('postId') postId: string,
    @Body() body: UpdatePostDto,
  ): Promise<I_GetData<Omit<T_Post, 'created_at' | 'updated_at'>>> {
    return this.postsService.updatePost(Number(postId), body)
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Post created successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  createPost(
    @Body() body: CreatePostDto,
  ): Promise<I_GetData<Omit<T_Post, 'created_at' | 'updated_at'>>> {
    return this.postsService.createPost(body)
  }

  @Delete(':postId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  deletePost(
    @Param('postId') postId: string,
  ): Promise<Omit<I_GetData<unknown>, 'data'>> {
    return this.postsService.deletePost(Number(postId))
  }
}
