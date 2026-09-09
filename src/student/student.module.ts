import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Empresa } from '@/empresa/entities/empresa.entity';
import { User } from '@/users/entities/user.entity';
import { MailService } from '@/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Empresa, User])],
  controllers: [StudentController],
  providers: [StudentService, MailService],
  exports: [StudentService],
})
export class StudentModule {}
