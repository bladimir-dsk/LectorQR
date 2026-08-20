import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessLogDto {
  @IsString()
  @ApiProperty()
  qrCode: string;

  @IsNumber()
  @ApiProperty()
  salonId: number;
}
