import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { Role } from '@/common/enums/rol.enum';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { UserActiveInterface } from '@/common/interfaces/user-active.interface';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('employees')
@ApiBasicAuth('jwt')
@Auth([Role.ADMIN])
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.employeesService.create(createEmployeeDto, user);
  }

  @Get()
  findAll(
    @ActiveUser() user: UserActiveInterface,
    @Query() pagination: PaginationDto,
  ) {
    return this.employeesService.findAll(user, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @ActiveUser() user: UserActiveInterface) {
    return this.employeesService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.employeesService.update(id, updateEmployeeDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.employeesService.remove(+id);
  }
}
