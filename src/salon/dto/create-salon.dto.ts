import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateSalonDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  issue: string;

  @IsDateString()
  @ApiProperty()
  timeIn: Date;

  @IsDateString()
  @ApiProperty()
  timeOut: Date;
}
