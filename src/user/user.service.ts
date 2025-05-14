import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserChapterProgress } from 'src/progress/user-chapter-progress.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(UserChapterProgress)
    private progressRepo: Repository<UserChapterProgress>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findAllWithProgress(): Promise<
    {
      id: number;
      email: string;
      role: string;
      badge: string;
      completedCount: number;
    }[]
  > {
    const users = await this.userRepo.find();
    const results: {
      id: number;
      email: string;
      role: 'user' | 'admin';
      badge: string;
      completedCount: number;
    }[] = [];

    for (const user of users) {
      const progress = await this.progressRepo.find({
        where: { user: { id: user.id }, completed: true },
      });

      const completedCount = progress.length;
      let badge = '🚀 En route';
      if (completedCount >= 2) badge = '🎯 Motivé';
      if (completedCount >= 5) badge = '🔥 Assidu';
      if (completedCount >= 8) badge = '🏆 Bravo !';

      results.push({
        id: user.id,
        email: user.email,
        role: user.role,
        badge,
        completedCount,
      });
    }
    return results;
  }
}
