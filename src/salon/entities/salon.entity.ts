import { Empresa } from 'src/empresa/entities/empresa.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('salones')
export class Salon {
  @PrimaryGeneratedColumn()
  id_salon: number;

  @Column()
  name: string;

  @Column()
  issue: string;

  @Column()
  timeIn: Date;

  @Column()
  timeOut: Date;

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
