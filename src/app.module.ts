import { Module } from '@nestjs/common';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspecialidadesModule } from './especialidades/especialidades.module';
import { DocentesModule } from './docentes/docentes.module';
import { MateriasModule } from './materias/materias.module';
import { ClasesModule } from './clases/clases.module';
import { InscritosModule } from './inscritos/inscritos.module';

@Module({
  imports: [EstudiantesModule, TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'pass',
      database: 'ANBA-DB',
      synchronize: true,
      autoLoadEntities: true
    }
  ), EspecialidadesModule, DocentesModule, MateriasModule, ClasesModule, InscritosModule],
})
export class AppModule {}
