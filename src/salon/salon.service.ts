import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Salon } from './entities/salon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from 'src/empresa/entities/empresa.entity';
import { Repository } from 'typeorm';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

@Injectable()
export class SalonService {
  constructor(
    @InjectRepository(Salon)
    private readonly salonRepository: Repository<Salon>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}
  async create(createSalonDto: CreateSalonDto, user: UserActiveInterface) {
    const empresa = await this.empresaRepository.findOne({
      where: {
        id_empresa: user.id_empresa,
      },
    });
    if (!empresa) {
      throw new BadRequestException('Empresa no encontrada');
    }
    const salon = this.salonRepository.create({
      ...createSalonDto,
      empresa,
      creatorName: user.name,
      creatorUser: user.email,
    });
    return await this.salonRepository.save(salon);
  }

  findAll() {
    return this.salonRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} salon`;
  }

  update(id: number, updateSalonDto: UpdateSalonDto) {
    return `This action updates a #${id} salon`;
  }

  remove(id: number) {
    return `This action removes a #${id} salon`;
  }
}
