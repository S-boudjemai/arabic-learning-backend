import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private repo: Repository<Review>,
  ) {}

  // Créer un nouvel avis
  create(data: Partial<Review>) {
    const review = this.repo.create(data);
    return this.repo.save(review);
  }

  // Voir tous les avis (admin)
  findAllAdmin() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  // Approuver un avis
  approve(id: number) {
    return this.repo.update(id, { isApproved: true });
  }

  // Supprimer un avis
  remove(id: number) {
    return this.repo.delete(id);
  }

  findAll() {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      where: { isApproved: true },
    });
  }
}
