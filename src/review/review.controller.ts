import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './review.entity';

@Controller('review')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  // Récupérer tous les avis
  @Get()
  findAll(): Promise<Review[]> {
    return this.service.findAll();
  }

  // Créer un avis
  @Post()
  create(@Body() body: Partial<Review>) {
    return this.service.create(body);
  }

  // Approuver un avis
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approve(Number(id));
  }

  // Supprimer un avis
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
  @Get('all')
  findAllAdmin(): Promise<Review[]> {
    return this.service.findAllAdmin();
  }
}
