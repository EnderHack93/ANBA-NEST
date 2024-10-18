import { Module } from '@nestjs/common';
import { MateriasService } from './materias.service';
import { MateriasController } from './materias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materia } from './entities/materia.entity';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import { Semestre } from 'src/semestre/entities/semestre.entity';
import { Estado } from 'src/estados/entites/estado.entity';
import { EstadoModule } from 'src/estados/estado.module';
import { SemestreModule } from 'src/semestre/semestre.module';

@Module({
  imports: [TypeOrmModule.forFeature([Materia,Especialidad,Semestre,Estado]),EstadoModule,SemestreModule],
  controllers: [MateriasController],
  providers: [MateriasService],
  exports: [MateriasService],
})
export class MateriasModule {}
