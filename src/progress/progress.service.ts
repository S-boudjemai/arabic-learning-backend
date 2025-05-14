import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserChapterProgress } from './user-chapter-progress.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(UserChapterProgress)
    private progressRepo: Repository<UserChapterProgress>,
  ) {}

  async getCompletedChapters(userId: number): Promise<UserChapterProgress[]> {
    return this.progressRepo.find({
      where: { user: { id: userId }, completed: true },
      relations: ['chapter'],
    });
  }

  async completeChapter(
    userId: number,
    chapterId: number,
  ): Promise<UserChapterProgress> {
    const existing = await this.progressRepo.findOne({
      where: { user: { id: userId }, chapter: { id: chapterId } },
    });

    if (existing) {
      existing.completed = true;
      return this.progressRepo.save(existing);
    }

    const progress = this.progressRepo.create({
      user: { id: userId },
      chapter: { id: chapterId },
      completed: true,
    });

    return this.progressRepo.save(progress);
  }
  async removeChapterForUser(userId: number, chapterId: number) {
    await this.progressRepo.delete({
      user: { id: userId },
      chapter: { id: chapterId },
    });
    return { message: 'Chapter unmarked as completed' };
  }

  async getUserBadge(userId: number): Promise<{ badge: string }> {
    const progress = await this.progressRepo.find({
      where: { user: { id: userId } },
    });

    const count = progress.length;

    let badge = '🚀 En route';
    if (count >= 2) badge = '🎯 Motivé';
    if (count >= 5) badge = '🔥 Assidu';
    if (count >= 8) badge = '🏆 Bravo !';

    return { badge };
  }
}
