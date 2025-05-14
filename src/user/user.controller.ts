import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('with-progress')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllWithProgress(): Promise<
    {
      id: number;
      email: string;
      role: string;
      badge: string;
      completedCount: number;
    }[]
  > {
    return this.userService.findAllWithProgress();
  }
}
