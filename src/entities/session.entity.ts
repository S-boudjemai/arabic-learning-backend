import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  // Début de session
  @CreateDateColumn()
  startedAt: Date;

  // Fin de session (nullable tant que la session est ouverte)
  @Column({ type: 'timestamptz', nullable: true })
  endedAt: Date | null;

  // Date de la dernière activité (pour détecter l’inactivité)
  @UpdateDateColumn()
  lastActivityAt: Date;
}
