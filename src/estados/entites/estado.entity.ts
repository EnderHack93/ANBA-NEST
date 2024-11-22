import { Administrador } from 'src/administradores/entities/administrador.entity';
import { Clase } from 'src/clases/entities/clase.entity';
import { EnumEstados } from 'src/common/enums/estados.enum';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import { Semestre } from 'src/semestre/entities/semestre.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('estado')
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:"enum", enum:EnumEstados, default:EnumEstados.ACTIVO})
  nombre: EnumEstados;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(()=> Especialidad, (especialidad) => especialidad.estado)
  especialidad: Especialidad[];

  @OneToMany(()=> Usuario, (usuario) => usuario.estado)
  usuario: Usuario[];

  @OneToMany(()=> Semestre, (semestre) => semestre.estado)
  semestre: Semestre[]

  @OneToMany(()=>Administrador, (administrador) => administrador.estado)
  administrador: Administrador[]

  @OneToMany(()=>Clase, (clase) => clase.estado)
  clase: Clase[]

}
