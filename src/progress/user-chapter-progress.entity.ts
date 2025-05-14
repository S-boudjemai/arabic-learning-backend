import { Chapter } from 'src/chapter/chapter.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['user', 'chapter']) // only one progress per user and chapter
export class UserChapterProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.progress, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Chapter, { eager: true, onDelete: 'CASCADE' })
  chapter: Chapter;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  completedAt: Date;
}
