import { MiddlewareConsumer, Module } from '@nestjs/common';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspecialidadesModule } from './especialidades/especialidades.module';
import { DocentesModule } from './docentes/docentes.module';
import { MateriasModule } from './materias/materias.module';
import { ClasesModule } from './clases/clases.module';
import { InscritosModule } from './inscritos/inscritos.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { AuthModule } from './auth/auth.module';
import { EstadoModule } from './estados/estado.module';
import { SemestreModule } from './semestre/semestre.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    EstudiantesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'pass',
      database: 'ANBA-DB',
      synchronize: true,
      autoLoadEntities: true,
    }),
    EspecialidadesModule,
    DocentesModule,
    MateriasModule,
    ClasesModule,
    InscritosModule,
    CloudinaryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    FastifyMulterModule,
    AuthModule,
    EstadoModule,
    SemestreModule,
    UsuariosModule,
  ],
})
export class AppModule {}
