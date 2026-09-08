import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SalonService } from './salon.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { FilterSalonDto } from './dto/filterSalon.dto';

@Controller('salon')
@ApiTags('salon')
@ApiBearerAuth('jwt')
@Auth(Role.ADMIN)
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  @Post()
  create(
    @Body() createSalonDto: CreateSalonDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.salonService.create(createSalonDto, user);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @ActiveUser() user: UserActiveInterface,
    @Query() filterSalonDto: FilterSalonDto,
  ) {
    return this.salonService.findAll(filterSalonDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @ActiveUser() user: UserActiveInterface) {
    return this.salonService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSalonDto: UpdateSalonDto) {
    return this.salonService.update(+id, updateSalonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.salonService.remove(+id);
  }
}
