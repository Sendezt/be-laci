import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama produk wajib diisi' })
  @MinLength(2, { message: 'Nama produk minimal 2 karakter' })
  @MaxLength(150, { message: 'Nama produk maksimal 150 karakter' })
  name: string;

  @IsUUID('4', { message: 'category_id harus berupa UUID valid' })
  @IsNotEmpty({ message: 'category_ud wajib diisi' })
  category_id: string;

  @IsInt({ message: 'Harga harus berupa bilangan bulat' })
  @Min(1, { message: 'Harga harus lebih besar dari 0' })
  selling_price: number;

  @IsString()
  @IsNotEmpty({ message: 'Satuan wajib diisi' })
  @MaxLength(50, { message: 'Satuan maksimal 50 karakter' })
  unit: string;

  @IsOptional()
  @IsUrl({}, { message: 'image_url harus berupa URL valid' })
  image_url?: string;
}
