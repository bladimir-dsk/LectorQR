import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { Empresa } from 'src/empresa/entities/empresa.entity';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import * as QRCode from 'qrcode';
import { MailService } from 'src/mail/mail.service';
import { FilterStudentDto } from './dto/filterDto.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly mailService: MailService,
  ) {}

  async create(createStudentDto: CreateStudentDto, user: UserActiveInterface) {
    const empresa = await this.empresaRepository.findOne({
      where: {
        id_empresa: user.id_empresa,
      },
    });
    if (!empresa) {
      throw new BadRequestException('Empresa no encontrada');
    }

    //validar email
    const emailexisting = await this.studentRepository.findOne({
      where: {
        email: createStudentDto.email,
      },
    });
    if (emailexisting) {
      throw new BadRequestException('Email ya registrado');
    }

    const student = this.studentRepository.create({
      ...createStudentDto,
      empresa,
      creatorName: user.name,
      creatorUser: user.email,
    });
    await this.studentRepository.save(student);
    const qrBuffer = await this.generateQrImage(student.qr_code);
    await this.mailService.sendQrEmail(student.email, student.name, qrBuffer);

    return student;
  }

  async findAll(filterDto: FilterStudentDto, user: UserActiveInterface) {
    const { page, limit } = filterDto;

    const query = this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.empresa', 'empresa')
      .where('empresa.id_empresa = :id_empresa', {
        id_empresa: user.id_empresa,
      });

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
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }

  async generateQrImage(qrCode: string): Promise<Buffer> {
    // Podés codificar solo el uuid, o una URL de tu frontend de "check-in"
    const payload = qrCode;
    // o: `https://tuapp.com/checkin/${qrCode}`

    return QRCode.toBuffer(payload, {
      type: 'png',
      width: 300,
      margin: 2,
    });
  }
}
