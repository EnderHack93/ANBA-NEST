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
    ConfigModule.forRoot({
    isGlobal: true,
      envFilePath: '.env',
    }),
    EstudiantesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
    }),
    EspecialidadesModule,
    DocentesModule,
    MateriasModule,
    ClasesModule,
    InscritosModule,
    CloudinaryModule,
    FastifyMulterModule,
    AuthModule,
    EstadoModule,
    SemestreModule,
    UsuariosModule,
  ],
})
export class AppModule {}
