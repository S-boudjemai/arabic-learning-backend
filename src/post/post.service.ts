import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepo.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  create(data: Partial<Post>): Promise<Post> {
    const post = this.postRepo.create(data);
    return this.postRepo.save(post);
  }

  remove(id: number): Promise<void> {
    return this.postRepo.delete(id).then(() => undefined);
  }

  async update(id: number, data: Partial<Post>): Promise<Post> {
    await this.postRepo.update(id, data);
    const updated = await this.postRepo.findOneBy({ id });
    if (!updated) throw new Error('Article non trouvé');
    return updated;
  }
}
