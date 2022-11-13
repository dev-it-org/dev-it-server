import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { Role } from '@prisma/client'

import { CreatePostDto, UpdatePostDto } from './dto'
import { PostsService } from './posts.service'
import { E_OrderBy, T_Post } from './models'

import { I_GetData } from 'src/models/app.model'
import { RolesGuard } from 'src/common'

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
  @ApiQuery({
    name: 'title',
    type: String,
    description: 'Posts title',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: String,
    description: 'Posts limit',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: String,
    description: 'Posts page',
    required: false,
  })
  @ApiQuery({
    name: 'sort',
    enum: E_OrderBy,
    description: 'Posts sort',
    required: false,
  })
  getPosts(
    @Query('title') title: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query('sort') sort: E_OrderBy = E_OrderBy.asc,
  ): Promise<I_GetData<{ posts: T_Post[] }>> {
    return this.postsService.getPosts(title, Number(limit), Number(page), sort)
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

  @UseGuards(AuthGuard('jwt'), RolesGuard([Role.Admin, Role.Moderator]))
  @ApiBearerAuth()
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

  @UseGuards(AuthGuard('jwt'), RolesGuard([Role.Admin, Role.Moderator]))
  @ApiBearerAuth()
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

  @UseGuards(AuthGuard('jwt'), RolesGuard([Role.Admin, Role.Moderator]))
  @ApiBearerAuth()
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
