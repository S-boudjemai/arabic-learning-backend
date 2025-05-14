import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from './chapter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private chapterRepo: Repository<Chapter>,
  ) {}

  findAll(): Promise<Chapter[]> {
    return this.chapterRepo.find({
      where: { isPublished: true },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: number): Promise<any> {
    const chapter = await this.chapterRepo.findOneBy({ id });
    if (!chapter) throw new NotFoundException('Chapter not found');

    const next = await this.chapterRepo.findOneBy({
      order: chapter.order + 1,
      isPublished: true,
    });
    const previous = await this.chapterRepo.findOneBy({
      order: chapter.order - 1,
      isPublished: true,
    });

    return {
      ...chapter,
      hasNext: !!next,
      hasPrevious: !!previous,
    };
  }

  async create(data: Partial<Chapter>): Promise<Chapter> {
    const chapter = this.chapterRepo.create(data);
    return this.chapterRepo.save(chapter);
  }

  async update(id: number, data: Partial<Chapter>): Promise<Chapter> {
    await this.chapterRepo.update(id, data);
    const updated = await this.chapterRepo.findOneBy({
      id,
    });
    if (!updated) throw new NotFoundException('Chapter not found');
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.chapterRepo.delete(id);
  }

  async findNext(currentId: number): Promise<Chapter | null> {
    const current = await this.chapterRepo.findOneBy({ id: currentId });
    if (!current) throw new NotFoundException('Chapter not found');

    const next = await this.chapterRepo.findOne({
      where: { order: current.order + 1, isPublished: true },
    });

    return next || null;
  }
  async findPrevious(currentId: number): Promise<Chapter | null> {
    const current = await this.chapterRepo.findOneBy({ id: currentId });
    if (!current) throw new NotFoundException('Chapter not found');

    const previous = await this.chapterRepo.findOne({
      where: { order: current.order - 1, isPublished: true },
    });

    return previous || null;
  }

  async findAllRaw(): Promise<Chapter[]> {
    return this.chapterRepo.find({
      order: { order: 'ASC' },
    });
  }
}
