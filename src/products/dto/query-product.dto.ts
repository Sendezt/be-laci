import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export const PRODUCT_SORT_OPTIONS = [
  'name_asc',
  'name_desc',
  'newest',
  'oldest',
  'price_asc',
  'price_desc',
] as const;

export type ProductSortOption = (typeof PRODUCT_SORT_OPTIONS)[number];

export class QueryProductDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID('4')
  category_id?: string;

  @IsOptional()
  @IsIn(PRODUCT_SORT_OPTIONS, {
    message: `sort harus salah satu dari: ${PRODUCT_SORT_OPTIONS.join(', ')}`,
  })
  sort?: ProductSortOption;
}
