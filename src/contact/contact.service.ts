import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactMessage } from './contact.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private contactRepo: Repository<ContactMessage>,
  ) {}

  async create(data: Partial<ContactMessage>) {
    const message = this.contactRepo.create(data);
    return this.contactRepo.save(message);
  }

  async findAll(): Promise<ContactMessage[]> {
    return this.contactRepo.find({ order: { createdAt: 'DESC' } });
  }
}
