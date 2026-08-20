import { Empresa } from 'src/empresa/entities/empresa.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id_student: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 100 })
  payment: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Empresa, (empresa) => empresa.students)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @Column({ nullable: true })
  creatorUser: string;

  @Column({ nullable: true })
  creatorName: string;

  @Column({ unique: true })
  qr_code: string;

  @BeforeInsert()
  generateQrCode() {
    this.qr_code = uuidv4();
  }
}
