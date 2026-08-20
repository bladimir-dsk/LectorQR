import { Empresa } from 'src/empresa/entities/empresa.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id_employee: number;

  @Column()
  nameEmployee: string;

  @Column({ nullable: true })
  email: string | null;

  @Column({ nullable: true })
  personalEmail: string | null;

  @Column()
  role: string;

  @Column({ nullable: false, default: false })
  applyToUser: boolean;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @Column({ nullable: false, default: true })
  active: boolean;

  @ManyToOne(() => Empresa, (empresa) => empresa.employees)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @ManyToOne(() => User, (user) => user.employee) // ✅
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @Column({ nullable: true })
  creatorUser: string;

  @Column({ nullable: true })
  creatorName: string;
}
