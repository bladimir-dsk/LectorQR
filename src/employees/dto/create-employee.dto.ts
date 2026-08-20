import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  nameEmployee: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  personalEmail?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  id_empresa?: number;

  @ApiProperty()
  @IsBoolean()
  active: boolean;

  @IsBoolean()
  @ApiProperty()
  applyToUser: boolean;

  @IsString()
  @ApiProperty()
  @ValidateIf((o) => o.applyToUser === true)
  name?: string;

  @IsString()
  @ApiProperty()
  @ValidateIf((o) => o.applyToUser === true)
  email?: string;

  @ValidateIf((o) => o.applyToUser === true)
  @ApiProperty()
  @IsString()
  password?: string;
}
