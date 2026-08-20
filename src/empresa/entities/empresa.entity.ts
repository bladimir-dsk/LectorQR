import { Employee } from 'src/employees/entities/employee.entity';
import { Salon } from 'src/salon/entities/salon.entity';
import { Student } from 'src/student/entities/student.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn()
  id_empresa: number;

  @Column({ nullable: false, default: 'sin name' })
  name: string;

  @Column({ nullable: true })
  rfc: string;

  @OneToMany(() => User, (user) => user.empresa)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Employee, (employee) => employee.empresa)
  employees: Employee[];

  @OneToMany(() => Student, (student) => student.empresa)
  students: Student[];

  @OneToMany(() => Salon, (salon) => salon.empresa)
  salones: Salon[];
}
