import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('semestre')
export class Semestre {

    @PrimaryGeneratedColumn()
    id_semestre:number

    @Column()
    nombre:string

    @Column()
    anio:number

    @Column()
    estado:string

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date
    
}
