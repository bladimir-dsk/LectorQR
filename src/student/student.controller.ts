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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { FilterStudentDto } from './dto/filterDto.dto';

@Controller('student')
@ApiTags('student')
@ApiBearerAuth('jwt')
@Auth(Role.ADMIN)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(
    @Body() createStudentDto: CreateStudentDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.studentService.create(createStudentDto, user);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @ActiveUser() user: UserActiveInterface,
    @Query() filterDto: FilterStudentDto,
  ) {
    return this.studentService.findAll(filterDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.studentService.remove(id);
  }
}
