import { UserChapterProgress } from 'src/progress/user-chapter-progress.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @Column()
  name: string;

  @OneToMany(() => UserChapterProgress, (progress) => progress.user)
  progress: UserChapterProgress[];
}
