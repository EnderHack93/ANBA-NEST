import { Module } from '@nestjs/common';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [EstudiantesModule, TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass',
      database: 'ANBA-DB',
      synchronize: true,
      autoLoadEntities: true
    }
  )],
})
export class AppModule {}
