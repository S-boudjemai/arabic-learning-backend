import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactMessage } from './contact.entity';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  create(@Body() data: Partial<ContactMessage>): Promise<ContactMessage> {
    return this.contactService.create(data);
  }

  @Get()
  findAll(): Promise<ContactMessage[]> {
    return this.contactService.findAll();
  }
}
