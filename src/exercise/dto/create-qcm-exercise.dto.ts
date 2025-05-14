import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCountExerciseDto {
  @IsEnum(['intro', 'final'])
  position: 'intro' | 'final';

  @IsString()
  @IsNotEmpty()
  letter: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  expectedCount: number;

  // images handled by interceptor, no body fields
  @IsOptional()
  chapterId?: number;
}
