import { Module } from '@nestjs/common';
import { EspecialidadesService } from './especialidades.service';
import { EspecialidadesController } from './especialidades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especialidad } from './entities/especialidad.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Especialidad])],
  controllers: [EspecialidadesController],
  providers: [EspecialidadesService],
  exports:[TypeOrmModule]
})
export class EspecialidadesModule {}
