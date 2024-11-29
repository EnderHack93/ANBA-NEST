import { Module } from '@nestjs/common';
import { CuadroDeMandoService } from './cuadro_de_mando.service';
import { CuadroDeMandoController } from './cuadro_de_mando.controller';
import { EstudiantesModule } from 'src/estudiantes/estudiantes.module';
import { EvaluacionesModule } from 'src/evaluaciones/evaluaciones.module';
import { AsistenciaModule } from 'src/asistencia/asistencia.module';
import { MateriasModule } from 'src/materias/materias.module';
import { ClasesModule } from 'src/clases/clases.module';

@Module({
  imports: [
    EstudiantesModule,
    EvaluacionesModule,
    AsistenciaModule,
    MateriasModule,
    ClasesModule,
  ],
  controllers: [CuadroDeMandoController],
  providers: [CuadroDeMandoService],
})
export class CuadroDeMandoModule {}
