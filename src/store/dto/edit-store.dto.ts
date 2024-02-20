import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditStoreDto {
  @IsString()
  @IsNotEmpty()
  storeTitle: string;

  @IsString()
  @IsOptional()
  storeDescription: string;

  @IsString()
  @IsOptional()
  storeLink: string;

  @IsOptional()
  userId: number;

}
