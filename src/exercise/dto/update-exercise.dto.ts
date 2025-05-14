import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateExerciseDto {
  @IsOptional()
  @IsEnum(['intro', 'final'])
  position?: 'intro' | 'final';

  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  choices?: string[];

  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @IsOptional()
  @IsString()
  translation?: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsString()
  example?: string;

  @IsOptional()
  @IsString()
  letter?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  expectedCount?: number;
}
