import { Chapter } from 'src/chapter/chapter.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chapter, { eager: true })
  chapter?: Chapter;

  @Column()
  position: 'intro' | 'final'; // Type d'exercice dans le chapitre

  @Column({ nullable: true })
  question?: string;

  @Column('text', { array: true, nullable: true })
  choices?: string[];

  @Column({ nullable: true })
  correctAnswer?: string;

  @Column({ nullable: true })
  translation?: string;

  @Column({ type: 'text', nullable: true })
  explanation?: string;

  @Column({ type: 'text', nullable: true })
  example?: string;

  @Column({ default: 'qcm' })
  type: 'qcm' | 'count';

  @Column({ nullable: true })
  letter: string;

  @Column({ nullable: true })
  expectedCount: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  solutionImageUrl?: string;
}
