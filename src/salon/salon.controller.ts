import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalonService } from './salon.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

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
  findAll() {
    return this.salonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalonDto: UpdateSalonDto) {
    return this.salonService.update(+id, updateSalonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salonService.remove(+id);
  }
}
