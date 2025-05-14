import {
  Body,
  Controller,
  Delete,
  Get,
  Post as HttpPost,
  Param,
  ParseIntPipe,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as BlogPost } from './post.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  findAll(): Promise<BlogPost[]> {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<BlogPost> {
    return this.postService.findOne(id);
  }

  @HttpPost()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `post-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<BlogPost> {
    const data: Partial<BlogPost> = {
      ...body,
      imageUrl: file ? `/uploads/${file.filename}` : undefined,
    };

    return this.postService.create(data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.postService.remove(id);
  }
}
