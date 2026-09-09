import { Module } from '@nestjs/common';
import { AccessLogService } from './access-log.service';
import { AccessLogController } from './access-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessLog } from './entities/access-log.entity';
import { Empresa } from '@/empresa/entities/empresa.entity';
import { User } from '@/users/entities/user.entity';
import { Salon } from '@/salon/entities/salon.entity';
import { Student } from '@/student/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessLog, Empresa, User, Salon, Student]),
  ],
  controllers: [AccessLogController],
  providers: [AccessLogService],
  exports: [AccessLogService],
})
export class AccessLogModule {}
