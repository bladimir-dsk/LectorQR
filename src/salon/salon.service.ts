import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Salon } from './entities/salon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from '@/empresa/entities/empresa.entity';
import { Repository } from 'typeorm';
import { UserActiveInterface } from '@/common/interfaces/user-active.interface';
import { FilterSalonDto } from './dto/filterSalon.dto';

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

  async findAll(filterSalonDto: FilterSalonDto, user: UserActiveInterface) {
    const { page, limit } = filterSalonDto;
    const query = this.salonRepository
      .createQueryBuilder('salon')
      .leftJoinAndSelect('salon.empresa', 'empresa')
      .where('empresa.id_empresa = :id_empresa', {
        id_empresa: user.id_empresa,
      });

    const shouldPaginate = !!page && !!limit;

    if (shouldPaginate) {
      query.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page: page ?? null,
        limit: limit ?? null,
        totalPages: shouldPaginate ? Math.ceil(total / limit) : null,
      },
    };
  }

  async findOne(id: number, user: UserActiveInterface) {
    const salon = await this.salonRepository.findOne({
      where: {
        id_salon: id,
        empresa: {
          id_empresa: user.id_empresa,
        },
      },
    });
    if (!salon) {
      throw new BadRequestException('Salon no encontrado');
    }
    return salon;
  }

  update(id: number, updateSalonDto: UpdateSalonDto) {
    return `This action updates a #${id} salon`;
  }

  remove(id: number) {
    return `This action removes a #${id} salon`;
  }
}
