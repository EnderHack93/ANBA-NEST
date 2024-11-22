import { Module } from '@nestjs/common';
import { ClasesService } from './clases.service';
import { ClasesController } from './clases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clase } from './entities/clase.entity';
import { Docente } from 'src/docentes/entities/docente.entity';
import { Materia } from 'src/materias/entities/materia.entity';
import { EstadoModule } from 'src/estados/estado.module';

@Module({
  imports: [TypeOrmModule.forFeature([Clase,Docente,Materia]),EstadoModule],
  controllers: [ClasesController],
  providers: [ClasesService],
  exports:[ClasesService]
})
export class ClasesModule {}
