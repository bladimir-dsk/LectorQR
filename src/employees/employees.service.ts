import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { DataSource, Repository, FindManyOptions, ILike } from 'typeorm';
import { Empresa } from 'src/empresa/entities/empresa.entity';
import { User } from 'src/users/entities/user.entity';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/common/enums/rol.enum';
import { PaginationDto } from './dto/pagination.dto';
import { Estatus } from 'src/common/enums/estatus.enum';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}
  async create(
    createEmployeeDto: CreateEmployeeDto,
    user: UserActiveInterface, // usuario autenticado que hace la petición
  ) {
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa: user.id_empresa },
    });

    if (!empresa) {
      throw new BadRequestException('Empresa no encontrada');
    }

    if (!createEmployeeDto.applyToUser && createEmployeeDto.email) {
      throw new BadRequestException(
        'El campo email no debe ser enviado si no aplica usuario',
      );
    }

    if (createEmployeeDto.applyToUser) {
      if (
        !createEmployeeDto.email ||
        !createEmployeeDto.password ||
        !createEmployeeDto.name
      ) {
        throw new BadRequestException(
          'Los campos email, password y name son requeridos cuando aplica usuario',
        );
      }

      const userExists = await this.userRepository.findOneBy({
        email: createEmployeeDto.email,
      });
      if (userExists) {
        throw new BadRequestException('El email ya está en uso');
      }

      const nameUserExists = await this.userRepository.findOneBy({
        name: createEmployeeDto.name,
      });
      if (nameUserExists) {
        throw new BadRequestException('El nombre de usuario ya está en uso');
      }
    }

    if (createEmployeeDto.email) {
      const existingEmployee = await this.employeeRepository.findOne({
        where: {
          email: createEmployeeDto.email,
          empresa: { id_empresa: empresa.id_empresa },
        },
      });
      if (existingEmployee) {
        throw new BadRequestException('El empleado ya existe');
      }
    }

    const existingNameGlobal = await this.employeeRepository.findOne({
      where: { nameEmployee: createEmployeeDto.nameEmployee },
    });
    if (existingNameGlobal) {
      throw new BadRequestException('El nombre del empleado ya existe');
    }

    // OJO: esta variable NUNCA debe llamarse igual que el parámetro `user`
    let usuario: User | null = null;

    if (createEmployeeDto.applyToUser) {
      const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);

      usuario = this.userRepository.create({
        name: createEmployeeDto.name,
        email: createEmployeeDto.email,
        password: hashedPassword,
        empresa,
        role: Role.EMPLEADO,
      });
    }

    return this.dataSource.transaction(async (manager) => {
      let userSaved: User | null = null;

      if (usuario) {
        userSaved = await manager.save(User, usuario);
      }

      const employee = this.employeeRepository.create({
        nameEmployee: createEmployeeDto.nameEmployee,
        personalEmail: createEmployeeDto.personalEmail ?? null,
        email: createEmployeeDto.email,
        role: Role.EMPLEADO,
        empresa,
        active: createEmployeeDto.active,
        applyToUser: createEmployeeDto.applyToUser,
        user: userSaved,
        creatorUser: user.email,
        creatorName: user.name,
      });

      await manager.save(Employee, employee);
      return employee;
    });
  }

  async findAll(user: UserActiveInterface, pagination: PaginationDto) {
    const { page, limit, nameEmployee, applyToUser, active } = pagination;

    const where: any = {
      empresa: { id_empresa: user.id_empresa },
    };

    if (nameEmployee) {
      where.nameEmployee = ILike(`%${nameEmployee}%`);
    }

    if (applyToUser !== undefined) {
      where.applyToUser = applyToUser;
    }

    if (active !== undefined) {
      where.active = active;
    }

    const findOptions: FindManyOptions<Employee> = {
      where,
      order: { created_at: 'DESC' },
    };

    if (page && limit) {
      findOptions.skip = (page - 1) * limit;
      findOptions.take = limit;

      const [employees, total] =
        await this.employeeRepository.findAndCount(findOptions);

      return {
        data: employees,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    const employees = await this.employeeRepository.find(findOptions);
    return {
      data: employees,
      total: employees.length,
    };
  }

  async findOne(id: number, user: UserActiveInterface) {
    const employee = await this.employeeRepository.findOne({
      where: {
        id_employee: id,
        empresa: {
          id_empresa: user.id_empresa,
        },
      },
    });
    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }
    return employee;
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
    user: UserActiveInterface,
  ) {
    const employee = await this.employeeRepository.findOne({
      where: {
        id_employee: id,
        empresa: { id_empresa: user.id_empresa },
      },
      relations: ['user', 'empresa'],
    });

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    // Valor resultante de applyToUser tras el patch (si no lo mandan, se mantiene el actual)
    const applyToUser = updateEmployeeDto.applyToUser ?? employee.applyToUser;

    // Valor resultante de active tras el patch
    const active = updateEmployeeDto.active ?? employee.active;

    if (!applyToUser && updateEmployeeDto.email) {
      throw new BadRequestException(
        'El campo email no debe ser enviado si applyToUser es false',
      );
    }

    // Caso: se está activando applyToUser por primera vez (no existe usuario vinculado aún)
    const isCreatingUser = applyToUser && !employee.user;

    if (isCreatingUser) {
      if (
        !updateEmployeeDto.email ||
        !updateEmployeeDto.password ||
        !updateEmployeeDto.name
      ) {
        throw new BadRequestException(
          'Los campos email, password y name son requeridos cuando applyToUser es true',
        );
      }

      const userExists = await this.userRepository.findOneBy({
        email: updateEmployeeDto.email,
      });
      if (userExists) {
        throw new BadRequestException('El email ya está en uso');
      }

      const nameUserExists = await this.userRepository.findOneBy({
        name: updateEmployeeDto.name,
      });
      if (nameUserExists) {
        throw new BadRequestException('El nombre de usuario ya está en uso');
      }
    }

    // Validar nombre de empleado único (excluyendo el propio registro)
    if (
      updateEmployeeDto.nameEmployee &&
      updateEmployeeDto.nameEmployee !== employee.nameEmployee
    ) {
      const existingNameGlobal = await this.employeeRepository.findOne({
        where: { nameEmployee: updateEmployeeDto.nameEmployee },
      });
      if (existingNameGlobal) {
        throw new BadRequestException('El nombre del empleado ya existe');
      }
    }

    // Validar email de empleado único dentro de la misma empresa (excluyendo el propio registro)
    if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
      const existingEmployee = await this.employeeRepository.findOne({
        where: {
          email: updateEmployeeDto.email,
          empresa: { id_empresa: employee.empresa.id_empresa },
        },
      });
      if (existingEmployee) {
        throw new BadRequestException('El empleado ya existe');
      }
    }

    return this.dataSource.transaction(async (manager) => {
      let userSaved = employee.user;

      if (isCreatingUser) {
        // Crear usuario nuevo porque el empleado no tenía uno vinculado
        const hashedPassword = await bcrypt.hash(
          updateEmployeeDto.password,
          10,
        );

        const nuevoUsuario = this.userRepository.create({
          name: updateEmployeeDto.name,
          email: updateEmployeeDto.email,
          password: hashedPassword,
          empresa: employee.empresa,
          role: Role.EMPLEADO,
          estatus: active ? Estatus.ACTIVO : Estatus.INACTIVO,
        });

        userSaved = await manager.save(User, nuevoUsuario);
      } else if (employee.user) {
        // Ya existía un usuario vinculado: solo sincronizamos su estatus
        const nuevoEstatus =
          !applyToUser || !active ? Estatus.INACTIVO : Estatus.ACTIVO;

        if (employee.user.estatus !== nuevoEstatus) {
          await manager.update(User, employee.user.id, {
            estatus: nuevoEstatus,
          });
          userSaved.estatus = nuevoEstatus;
        }
      }

      const employeeUpdate: Partial<Employee> = {
        nameEmployee: updateEmployeeDto.nameEmployee ?? employee.nameEmployee,
        email: updateEmployeeDto.email ?? employee.email,
        personalEmail:
          updateEmployeeDto.personalEmail ?? employee.personalEmail,
        active,
        applyToUser,
        user: userSaved,
        creatorUser: user.email,
        creatorName: user.name,
      };

      await manager.update(Employee, id, employeeUpdate);

      return manager.findOne(Employee, {
        where: { id_employee: id },
        relations: ['user', 'empresa'],
      });
    });
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
