import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  async getProgress(@Request() req) {
    const userId = req.user.sub;
    return this.progressService.getCompletedChapters(userId);
  }

  @Post(':chapterId')
  async complete(@Request() req, @Param('chapterId') chapterId: string) {
    const userId = req.user.sub;
    return this.progressService.completeChapter(userId, Number(chapterId));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':chapterId')
  async unmark(@Param('chapterId') chapterId: number, @Request() req) {
    return this.progressService.removeChapterForUser(req.user.sub, chapterId);
  }

  @Get('badge')
  @UseGuards(JwtAuthGuard)
  getBadge(@Request() req): Promise<{ badge: string }> {
    return this.progressService.getUserBadge(req.user.userId);
  }
}
