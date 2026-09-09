import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ParseBoolean } from '@/auth/decorators/parse-boolean.decorator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  nameEmployee?: string;

  @IsOptional()
  @ParseBoolean()
  @IsBoolean()
  applyToUser?: boolean;

  @IsOptional()
  @ParseBoolean()
  @IsBoolean()
  active?: boolean;
}
