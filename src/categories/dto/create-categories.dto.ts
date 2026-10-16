import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({message: 'Nama kategori wajib diisi'})
  @MaxLength(100, {message: 'Nama kategori maksimal 100 karakter'})
  @MinLength(2, {message: 'Nama kategori minimal 2 karakter'})
  name: string;
}
