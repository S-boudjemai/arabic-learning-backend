import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ProgressService } from 'src/progress/progress.service';
import { UserChapterProgress } from 'src/progress/user-chapter-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserChapterProgress])], // No additional modules needed for this example
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // Exporting UserService to be used in other modules
})
export class UserModule {}
