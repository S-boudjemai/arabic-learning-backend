import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { Chapter } from './chapter.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Get()
  findAll(): Promise<Chapter[]> {
    return this.chapterService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('all')
  findAllChaptersAdmin(): Promise<Chapter[]> {
    return this.chapterService.findAllRaw();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Chapter> {
    return this.chapterService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Chapter>,
  ): Promise<Chapter> {
    return this.chapterService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.chapterService.remove(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'video', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
        { name: 'image', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
      },
    ),
  )
  create(
    @Body() body: any,
    @UploadedFiles()
    files: {
      video?: Express.Multer.File[];
      audio?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
  ): Promise<Chapter> {
    const data: Partial<Chapter> = {
      ...body,
      videoUrl: files.video?.[0]
        ? `/uploads/${files.video[0].filename}`
        : undefined,
      audioUrl: files.audio?.[0]
        ? `/uploads/${files.audio[0].filename}`
        : undefined,
      imageUrl: files.image?.[0]
        ? `/uploads/${files.image[0].filename}`
        : undefined,
    };

    return this.chapterService.create(data);
  }

  @Get('next/:id')
  findNext(@Param('id', ParseIntPipe) id: number): Promise<Chapter | null> {
    return this.chapterService.findNext(id);
  }

  @Get('previous/:id')
  findPrevious(@Param('id', ParseIntPipe) id: number): Promise<Chapter | null> {
    return this.chapterService.findPrevious(id);
  }
}
