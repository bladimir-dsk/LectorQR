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
import { AccessLogService } from './access-log.service';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { FilterAccessLogDto } from './dto/filter-access-log.dto';

@ApiTags('access-log')
@ApiBearerAuth('jwt')
@Auth(Role.ADMIN)
@Controller('access-log')
export class AccessLogController {
  constructor(private readonly accessLogService: AccessLogService) {}

  @Post()
  create(
    @Body() createAccessLogDto: CreateAccessLogDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.accessLogService.create(createAccessLogDto, user);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'salonId', required: false, type: Number })
  findAll(
    @Query() filterDto: FilterAccessLogDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.accessLogService.findAll(filterDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.accessLogService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateAccessLogDto: UpdateAccessLogDto,
  ) {
    return this.accessLogService.update(id, updateAccessLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.accessLogService.remove(id);
  }
}
