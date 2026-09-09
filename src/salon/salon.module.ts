import { Module } from '@nestjs/common';
import { SalonService } from './salon.service';
import { SalonController } from './salon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salon } from './entities/salon.entity';
import { Empresa } from '@/empresa/entities/empresa.entity';
import { User } from '@/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Salon, Empresa, User])],
  controllers: [SalonController],
  providers: [SalonService],
  exports: [SalonService],
})
export class SalonModule {}
