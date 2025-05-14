import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateQcmExerciseDto {
  @IsEnum(['intro', 'final'])
  position: 'intro' | 'final';

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  @ArrayMinSize(3)
  @IsString({ each: true })
  choices: string[];

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @IsString()
  @IsOptional()
  translation?: string;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsString()
  @IsOptional()
  example?: string;
}
