import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  message: string;

  @Column()
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isApproved: boolean;
}
