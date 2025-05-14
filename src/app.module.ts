import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@nestjs/config';
import { ChapterModule } from './chapter/chapter.module';
import { ProgressModule } from './progress/progress.module';
import { ContactModule } from './contact/contact.module';
import { ReviewModule } from './review/review.module';
import { PostModule } from './post/post.module';
import { ExerciseModule } from './exercise/exercise.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    ChapterModule,
    ProgressModule,
    ContactModule,
    ReviewModule,
    PostModule,
    ExerciseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
