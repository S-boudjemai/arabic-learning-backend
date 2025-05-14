import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { Chapter } from '../chapter/chapter.entity';
import {
  CreateQcmExerciseDto,
  CreateCountExerciseDto,
  UpdateExerciseDto,
} from './dto';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,

    @InjectRepository(Chapter)
    private readonly chapterRepo: Repository<Chapter>,
  ) {}

  /**
   * Précharge le chapitre et lève NotFoundException si absent
   */
  private async preloadChapter(id: number): Promise<Chapter> {
    const chapter = await this.chapterRepo.findOneBy({ id });
    if (!chapter) throw new NotFoundException(`Chapitre ${id} introuvable`);
    return chapter;
  }

  /**
   * Création d'un exercice QCM
   */
  async createQcm(
    chapterId: number,
    dto: CreateQcmExerciseDto,
  ): Promise<Exercise> {
    const chapter = await this.preloadChapter(chapterId);
    const exercise = this.exerciseRepo.create({
      ...dto,
      type: 'qcm',
      chapter,
    });
    return this.exerciseRepo.save(exercise);
  }

  /**
   * Création d'un exercice de type "count" avec gestion des URLs d'images
   */
  async createCount(
    chapterId: number,
    dto: CreateCountExerciseDto & {
      imageUrl?: string;
      solutionImageUrl?: string;
    },
  ): Promise<Exercise> {
    const chapter = await this.preloadChapter(chapterId);
    const exercise = this.exerciseRepo.create({
      ...dto,
      type: 'count',
      chapter,
    });
    return this.exerciseRepo.save(exercise);
  }

  /**
   * Récupère les exercices paginés par chapitre
   */
  async findByChapterPaginated(
    chapterId: number,
    opts: { page: number; limit: number },
  ) {
    const [items, total] = await this.exerciseRepo.findAndCount({
      where: { chapter: { id: chapterId } },
      skip: (opts.page - 1) * opts.limit,
      take: opts.limit,
      order: { id: 'ASC' },
    });
    return { items, total, page: opts.page, limit: opts.limit };
  }

  /**
   * Récupère un exercice par ID
   */
  async findOne(id: number): Promise<Exercise> {
    const exercise = await this.exerciseRepo.findOneBy({ id });
    if (!exercise) throw new NotFoundException(`Exercice ${id} introuvable`);
    return exercise;
  }

  /**
   * Mise à jour partielle d'un exercice
   */
  async update(id: number, updateDto: UpdateExerciseDto): Promise<Exercise> {
    await this.exerciseRepo.update(id, updateDto);
    return this.findOne(id);
  }

  /**
   * Suppression d'un exercice et nettoyage des fichiers associés
   */
  async remove(id: number): Promise<void> {
    const exercise = await this.findOne(id);
    // Nettoyage des fichiers média si existants
    if (exercise.imageUrl) {
      const filePath = join(process.cwd(), exercise.imageUrl);
      await unlink(filePath).catch(() => {
        // si échec, log ou ignore
      });
    }
    if (exercise.solutionImageUrl) {
      const filePath = join(process.cwd(), exercise.solutionImageUrl);
      await unlink(filePath).catch(() => {});
    }
    await this.exerciseRepo.delete(id);
  }
}
