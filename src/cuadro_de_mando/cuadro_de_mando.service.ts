import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateCuadroDeMandoDto } from './dto/create-cuadro_de_mando.dto';
import { UpdateCuadroDeMandoDto } from './dto/update-cuadro_de_mando.dto';
import axios from 'axios';
import { lastValueFrom } from 'rxjs';
import { EstudiantesService } from 'src/estudiantes/estudiantes.service';
import { EvaluacionesService } from 'src/evaluaciones/evaluaciones.service';
import { AsistenciaService } from 'src/asistencia/asistencia.service';
import { getRandomValues, randomInt } from 'crypto';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { EstudiantePredictionDto } from 'src/estudiantes/dto/estudiante-prediction.dto';
import { MateriasService } from 'src/materias/materias.service';
import { ClasesService } from 'src/clases/clases.service';

@Injectable()
export class CuadroDeMandoService {
  constructor(
    private readonly estudiantesService: EstudiantesService,
    private readonly evaluacionService: EvaluacionesService,
    private readonly asistenciaService: AsistenciaService,
    private readonly materiasService: MateriasService,
    private readonly clasesService: ClasesService,
  ) {}

  private readonly apiUrl = 'http://127.0.0.1:8001/predict'; // URL del modelo FastAPI

  async obtenerPrediccion(datos: any): Promise<any> {
    try {
      // Realizar la solicitud a la API de FastAPI
      const response = await axios.post(this.apiUrl, datos);

      // Retornar la respuesta de la API
      return response.data;
    } catch (error) {
      // Manejar errores y retornar una excepción personalizada
      console.error(
        'Error al realizar la predicción:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Error al comunicarse con la API de predicción',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async bulkPredict(query: PaginateQuery) {
    // Obtener los estudiantes con paginación
    const studentsPaginated = await this.obtenerEstadoEstudiantes(query);

    // Procesar predicciones para cada estudiante en la página actual
    const predictions = await Promise.all(
      studentsPaginated.data.map(async (student) => {
        const { data } = student.estudiante; // Extraer los datos necesarios
        console.log(data);

        try {
          const response = await axios.post(this.apiUrl, data); // Realizar predicción
          return {
            nombre: student.estudiante.nombre,
            especialidad: student.estudiante.especialidad,
            prediccion: response.data,
          };
        } catch (error) {
          console.error(`Error al predecir para ${student.estudiante.nombre}`);
          return {
            nombre: student.estudiante.nombre,
            especialidad: student.estudiante.especialidad,
            prediccion: null,
            error: error.message,
          };
        }
      }),
    );

    // Retornar los datos de predicciones junto con la paginación
    return {
      data: predictions, // Datos procesados con predicciones
      meta: studentsPaginated.meta, // Metadatos de paginación
      links: studentsPaginated.links, // Enlaces de navegación
    };
  }

  async getCrecimientoEstudiantes() {
    const crecimiento = await this.materiasService.getCrecimientoEstudiantes();
    return crecimiento;
  }

  async getRendimientoGeneral() {
    const promedioPorDocente = await this.clasesService.getRendimientoGeneral();
    const promedioPorSemestre = await this.evaluacionService.getRendimientoPorSemestre();
    const promedioPorEstudiante = await this.evaluacionService.getRendimientoPorEstudiante();
    return {promedioPorDocente,promedioPorSemestre,promedioPorEstudiante};
  }

  async getAsistenciaPorFecha(startDate: string, endDate: string) {
    const asistencia = await this.asistenciaService.getAsistenciaPorFecha(
      startDate,
      endDate,
    );
    const asistencia2 = await this.evaluacionService.getPromedioNotasPorClase()
    const asistencia3 = await this.evaluacionService.getRendimientoPorSemestre()
    return {asistencia, asistencia2,asistencia3};
  }

  async obtenerEstadoEstudiantes(query: PaginateQuery) {
    try {
      const paginatedEstudiantes =
        await this.estudiantesService.getAllEstudiantesPredict(query);
      const allEstudiantesData = paginatedEstudiantes.data;
      const processedData = await Promise.all(
        allEstudiantesData.map(async (estudiante) => ({
          estudiante: {
            nombre: `${estudiante.nombres} ${estudiante.apellidos}`,
            especialidad: estudiante.especialidad.nombre,
            data: {
              Edad: await this.calculateEdad(estudiante.fecha_nacimiento),
              Promedio_Final:
                (await this.calculatePromedio(estudiante.id_estudiante)) | 0,
              Asistencia_Total:
                (await this.asistenciaService.getPorcentajeAsistenciaEstudiante(
                  estudiante.id_estudiante,
                )) | 0,
              Num_Faltas: await this.asistenciaService.getNumeroDeFaltas(
                estudiante.id_estudiante,
              ),
              Porcentaje_Inasistencia:
                (await this.calculateProcentajeInasistencia(
                  estudiante.id_estudiante,
                )) | 0,
              porc_Materias_Reprobadas: 0,
              porc_Materias_Aprobadas: 100,
              Genero_M: randomInt(2),
              ...(await this.setEspecialidades(estudiante.id_estudiante)),
            },
          },
        })),
      );
      return {
        data: processedData,
        meta: paginatedEstudiantes.meta, // Incluye los metadatos de la paginación
        links: paginatedEstudiantes.links, // Incluye los enlaces de la paginación
      };
    } catch (error) {
      throw new BadRequestException(
        'Error al realizar la predicción:' + error.message,
      );
    }
  }
  private async setEspecialidades(id_estudiante: string) {
    const especialidad =
      await this.estudiantesService.getEspecialidadEstudiante(id_estudiante);
    const especialidades = {
      Especialidad_DIBUJO: especialidad === 'Dibujo' ? 1 : 0,
      Especialidad_PINTURA: especialidad === 'Pintura' ? 1 : 0,
      Especialidad_ESCULTURA: especialidad === 'Escultura' ? 1 : 0,
      Especialidad_GRAFICAS: especialidad === 'Graficas' ? 1 : 0,
    };
    return especialidades;
  }
  private async calculateProcentajeInasistencia(id_estudiante: string) {
    const asistencia =
      await this.asistenciaService.getPorcentajeAsistenciaEstudiante(
        id_estudiante,
      );
    const result = 100 - asistencia;
    return result;
  }
  private async calculateEdad(fecha_nacimiento: Date) {
    const today = new Date();
    const birthDate = new Date(fecha_nacimiento);
    let edad = today.getFullYear() - birthDate.getFullYear();
    return edad;
  }
  private async calculatePromedio(id_estudiante: string) {
    const promedio =
      await this.evaluacionService.getPromedioEstudiante(id_estudiante);
    return promedio;
  }
}
