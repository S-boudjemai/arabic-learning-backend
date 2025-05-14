import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ nullable: true })
  audioUrl: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: false })
  isPublished: boolean;
}
