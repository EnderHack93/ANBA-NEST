import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Estudiante {
  @Column({ primary: true })
  id_estudiante: string;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column()
  fecha_nacimiento: Date;

  @Column()
  correo: string;

  @Column()
  carnet: string;

  @Column({ nullable: true })
  telefono: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
