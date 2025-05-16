import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;

  // L’utilisateur (nullable si visiteur non authentifié)
  @ManyToOne(() => User, { nullable: true })
  user: User | null;

  // La route visitée (ex. "/dashboard" ou "/")
  @Column()
  path: string;

  // Timestamp de la visite
  @CreateDateColumn()
  createdAt: Date;
}
