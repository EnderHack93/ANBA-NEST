import { Module } from '@nestjs/common';
import { EspecialidadesService } from './especialidades.service';
import { EspecialidadesController } from './especialidades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especialidad } from './entities/especialidad.entity';
import { Estado } from 'src/estados/entites/estado.entity';
import { EstadoModule } from 'src/estados/estado.module';

@Module({
  imports:[TypeOrmModule.forFeature([Especialidad,Estado]), EstadoModule],
  controllers: [EspecialidadesController],
  providers: [EspecialidadesService],
  exports:[TypeOrmModule]
})
export class EspecialidadesModule {}
