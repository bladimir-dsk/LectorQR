import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class FilterAccessLogDto {
  @ApiPropertyOptional({ description: 'Página actual' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @ApiPropertyOptional({ description: 'Cantidad de registros por página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number;

  @ApiPropertyOptional({ description: 'Filtrar por id del salón' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  salonId?: number;
}
