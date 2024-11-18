import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { AsistenciaModule } from './asistencia/asistencia.module';
import { SecurityModule } from './security/security.module';
import { AdministradoresModule } from './administradores/administradores.module';
import { LoggingMiddleware } from './security/middlewares/security_logs.middleware';
import { EmailModule } from './email/email.module';

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
    AsistenciaModule,
    SecurityModule,
    AdministradoresModule,
    EmailModule,
  ],
})
export class AppModule {
}
