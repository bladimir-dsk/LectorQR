import { Empresa } from 'src/empresa/entities/empresa.entity';
import { Salon } from 'src/salon/entities/salon.entity';
import { Student } from 'src/student/entities/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('access_log')
@Unique(['student', 'salon'])
export class AccessLog {
  @PrimaryGeneratedColumn()
  id_access: number;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Salon)
  salon: Salon;

  @CreateDateColumn()
  scanned_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Empresa, (empresa) => empresa.salones)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @Column({ nullable: true })
  creatorUser: string;

  @Column({ nullable: true })
  creatorName: string;
}
