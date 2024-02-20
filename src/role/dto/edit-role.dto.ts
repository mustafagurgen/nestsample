import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class EditRoleDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
