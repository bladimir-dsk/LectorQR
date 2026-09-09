import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessLog } from './entities/access-log.entity';
import { Empresa } from '@/empresa/entities/empresa.entity';
import { Repository } from 'typeorm';
import { UserActiveInterface } from '@/common/interfaces/user-active.interface';
import { Salon } from '@/salon/entities/salon.entity';
import { Student } from '@/student/entities/student.entity';
import { FilterAccessLogDto } from './dto/filter-access-log.dto';

@Injectable()
export class AccessLogService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(AccessLog)
    private readonly accessLogRepository: Repository<AccessLog>,
    @InjectRepository(Salon)
    private readonly salonRepository: Repository<Salon>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}
  async create(
    createAccessLogDto: CreateAccessLogDto,
    user: UserActiveInterface,
  ) {
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa: user.id_empresa },
    });
    if (!empresa) {
      throw new BadRequestException('Empresa no encontrada');
    }

    const salon = await this.salonRepository.findOne({
      where: { id_salon: createAccessLogDto.salonId },
    });
    if (!salon) {
      throw new BadRequestException('Salon no encontrado');
    }

    const studentQR = await this.studentRepository.findOne({
      where: { qr_code: createAccessLogDto.qrCode },
    });
    if (!studentQR) {
      throw new BadRequestException('Estudiante no encontrado');
    }

    // Validación a nivel de app (rápida, evita pegarle a la BD con un insert innecesario)
    const existingAccess = await this.accessLogRepository.findOne({
      where: {
        student: { qr_code: studentQR.qr_code },
        salon: { id_salon: salon.id_salon },
      },
    });
    if (existingAccess) {
      throw new BadRequestException(
        `El estudiante ya registró su ingreso al salón "${salon.name}"`,
      );
    }

    const newAccessLog = this.accessLogRepository.create({
      empresa,
      salon,
      student: studentQR,
      creatorName: user.name,
      creatorUser: user.email,
    });

    try {
      await this.accessLogRepository.save(newAccessLog);
    } catch (error) {
      // Red de seguridad: si dos requests llegan casi simultáneos y ambos
      // pasan el findOne de arriba, la BD igual rechaza el duplicado.
      if (error === '23505') {
        throw new BadRequestException(
          `El estudiante ya registró su ingreso al salón "${salon.name}"`,
        );
      }
      throw error;
    }

    return {
      message: 'Acceso registrado correctamente',
      data: {
        student: { name: studentQR.name, email: studentQR.email },
        salon: salon.name,
        scanned_at: newAccessLog.scanned_at,
      },
    };
  }

  async findAll(filterDto: FilterAccessLogDto, user: UserActiveInterface) {
    const { page, limit, salonId } = filterDto;

    const query = this.accessLogRepository
      .createQueryBuilder('access')
      .leftJoinAndSelect('access.student', 'student')
      .leftJoinAndSelect('access.salon', 'salon')
      .leftJoinAndSelect('access.empresa', 'empresa')
      .where('empresa.id_empresa = :id_empresa', {
        id_empresa: user.id_empresa,
      })
      .orderBy('access.scanned_at', 'DESC');

    if (salonId) {
      query.andWhere('salon.id_salon = :salonId', { salonId });
    }

    // Solo pagina si el front mandó ambos parámetros
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
        totalPages: shouldPaginate ? Math.ceil(total / limit) : 1,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} accessLog`;
  }

  update(id: number, updateAccessLogDto: UpdateAccessLogDto) {
    return `This action updates a #${id} accessLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} accessLog`;
  }
}
