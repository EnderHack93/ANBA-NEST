import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('security_logs')
export class Security {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: string;

  @Column({ name: 'ip_address', type: 'varchar'})
  ipAddress: string;

  @Column({ type: 'varchar', length: 10 })
  action: string;

  @Column({ name: 'table_name', type: 'varchar' })
  tableName: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  details: object;
}
