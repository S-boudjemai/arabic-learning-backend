import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Body,
  Query,
  DefaultValuePipe,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ExerciseService } from './exercise.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  CreateQcmExerciseDto,
  CreateCountExerciseDto,
  UpdateExerciseDto,
} from './dto';

@Controller('exercises')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  /**
   * Création d'un exercice QCM ou Count.
   * Stockage des fichiers géré par UploadModule (diskStorage).
   */
  @Post()
  @Roles('admin')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'solutionImage', maxCount: 1 },
    ]),
  )
  async create(
    @Body()
    body: { type: 'qcm' | 'count'; chapterId: number } & Record<string, any>,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      solutionImage?: Express.Multer.File[];
    },
  ) {
    if (body.type === 'qcm') {
      // Validation via DTO
      const dto = new CreateQcmExerciseDto();
      Object.assign(dto, body);
      return this.exerciseService.createQcm(body.chapterId, dto);
    }

    if (body.type === 'count') {
      // Validation via DTO
      const dto = new CreateCountExerciseDto();
      Object.assign(dto, body);
      // Préparation des URLs de fichiers
      const imageUrl = files.image
        ? `/uploads/${files.image[0].filename}`
        : undefined;
      const solutionImageUrl = files.solutionImage
        ? `/uploads/${files.solutionImage[0].filename}`
        : undefined;
      // Fusion DTO + URLs
      const data = { ...dto, imageUrl, solutionImageUrl };
      return this.exerciseService.createCount(body.chapterId, data);
    }

    throw new BadRequestException('Invalid exercise type');
  }

  /**
   * Liste paginée des exercices d'un chapitre.
   */
  @Get('chapter/:chapterId')
  @Roles('admin', 'user')
  async findByChapter(
    @Param('chapterId', ParseIntPipe) chapterId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.exerciseService.findByChapterPaginated(chapterId, {
      page,
      limit,
    });
  }

  /**
   * Récupérer un exercice par ID.
   */
  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseService.findOne(id);
  }

  /**
   * Mettre à jour un exercice existant.
   */
  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateExerciseDto,
  ) {
    return this.exerciseService.update(id, updateDto);
  }

  /**
   * Supprimer un exercice.
   */
  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseService.remove(id);
  }
}
