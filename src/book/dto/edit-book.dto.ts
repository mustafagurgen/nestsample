import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditBookDto {
  @IsString()
  @IsNotEmpty()
  bookTitle: string;

  @IsString()
  @IsOptional()
  bookDescription: string;

  @IsString()
  bookAuthor: string;

  @IsString()
  bookPublisher: string;

  @IsOptional()
  userId: number;

}
