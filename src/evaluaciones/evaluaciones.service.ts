import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { ChangeEvaluacionDto } from './dto/change-evaluacion.dto';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Evaluacion } from './entities/evaluacion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClasesService } from 'src/clases/clases.service';
import { EstudiantesService } from 'src/estudiantes/estudiantes.service';
import { EnumEstados } from 'src/common/enums/estados.enum';
import { InscritosService } from 'src/inscritos/inscritos.service';
import { IniciarRegistrosDto } from './dto/iniciar-registros.dto';
import { ConfirmarEvaluacionDto } from './dto/confirm-evaluacion.dto';
import { EstadoService } from 'src/estados/estado.service';

@Injectable()
export class EvaluacionesService {
  constructor(
    @InjectRepository(Evaluacion)
    private readonly evaluacionReository: Repository<Evaluacion>,
    private readonly claseService: ClasesService,
    private readonly estudiantesService: EstudiantesService,
    private readonly inscritosService: InscritosService,
    private readonly estadoService: EstadoService,
  ) {}
  async create(createEvaluacionDto: CreateEvaluacionDto) {
    const { id_clase, id_estudiante } = createEvaluacionDto;
    const clase = await this.claseService.findOne(id_clase);

    if (!clase) {
      throw new NotFoundException('Clase no encontrada');
    }

    if (clase.estado.nombre === EnumEstados.INACTIVO) {
      throw new NotFoundException('Clase inactiva');
    }

    const estudiante = await this.estudiantesService.findOne(id_estudiante);

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    if (estudiante.estado.nombre === EnumEstados.INACTIVO) {
      throw new NotFoundException('Estudiante inactivo');
    }

    const evaluacion = await this.evaluacionReository.save({
      ...createEvaluacionDto,
      clase,
      estudiante,
    });

    return evaluacion;
  }

  async getPromedioNotasPorClase(): Promise<any> {
    const result = await this.evaluacionReository
      .createQueryBuilder("evaluacion")
      .innerJoinAndSelect("evaluacion.clase", "clase")
      .select("clase.nombre", "label")
      .addSelect("AVG(evaluacion.nota)", "promedio")
      .groupBy("clase.id_clase")
      .getRawMany();
  
    return {
      labels: result.map((item) => item.label),
      data: result.map((item) => parseFloat(item.promedio.toFixed(2))),
    };
  }

  async getRendimientoPorSemestre(): Promise<any> {
    const result = await this.evaluacionReository
      .createQueryBuilder("evaluacion")
      .innerJoinAndSelect("evaluacion.clase", "clase") // Relación con materia
      .innerJoinAndSelect("clase.materia", "materia")
      .innerJoinAndSelect("materia.semestre", "semestre") // Relación con semestre desde materia
      .select("semestre.nombre", "label")
      .addSelect("AVG(evaluacion.nota)", "promedio")
      .groupBy("semestre.id_semestre")
      .orderBy("semestre.id_semestre", "ASC")
      .getRawMany();
  
    return {
      labels: result.map((item) => item.label),
      data: result.map((item) => parseFloat(item.promedio.toFixed(2))),
    };
  }

  async getRendimientoPorEstudiante(): Promise<any> {
    const result = await this.evaluacionReository
      .createQueryBuilder("evaluacion")
      .innerJoin("evaluacion.estudiante", "estudiante")
      .select("estudiante.nombres || ' ' || estudiante.apellidos", "label")
      .addSelect("AVG(evaluacion.nota)", "promedio")
      .groupBy("estudiante.id_estudiante")
      .orderBy("promedio", "DESC")
      .getRawMany();
  
    return {
      labels: result.map((item) => item.label),
      data: result.map((item) => parseFloat(item.promedio.toFixed(2))),
    };
  }
  
  
  
  

  async iniciarRecordEvaluacion(iniciarRegistrosDto: IniciarRegistrosDto) {
    const { id_clase, tipo_evaluacion } = iniciarRegistrosDto;

    // Buscar la clase
    const clase = await this.claseService.findOne(id_clase);
    if (!clase) {
      throw new NotFoundException('Clase no encontrada');
    }

    if (clase.estado.nombre === EnumEstados.INACTIVO) {
      throw new NotFoundException('Clase inactiva');
    }

    // Buscar estudiantes inscritos en la clase
    const estudiantesInscritos =
      await this.inscritosService.findInscritosByClase(id_clase);
    if (!estudiantesInscritos.length) {
      throw new NotFoundException('No hay estudiantes inscritos en esta clase');
    }

    // Verificar que los estudiantes están activos
    const evaluacionesCreadas = [];
    for (const estudiante of estudiantesInscritos) {
      // Crear evaluación con nota inicial 0
      const evaluacion = await this.evaluacionReository.save({
        ...iniciarRegistrosDto,
        tipo_evaluacion,
        estudiante,
        clase,
        nota: 0, // Nota inicial
      });

      evaluacionesCreadas.push(evaluacion);
    }

    return {
      message: 'Evaluaciones creadas exitosamente',
      evaluaciones: evaluacionesCreadas,
    };
  }

  async cambiarValorEvaluacion(
    changeEvaluacionDto: ChangeEvaluacionDto,
    id_docente: string,
  ) {
    const { id_evaluacion, nuevaNota } = changeEvaluacionDto;
    const evaluacion = await this.evaluacionReository.findOne({
      where: { id_evaluacion, clase: { docente: { id_docente } } },
      relations: ['estudiante', 'clase'],
    });
    if (!evaluacion) {
      throw new NotFoundException('Evaluación no encontrada');
    }
    evaluacion.nota = nuevaNota;
    await this.evaluacionReository.save(evaluacion);
    return evaluacion;
  }
  async findAll(query: PaginateQuery): Promise<Paginated<Evaluacion>> {
    return paginate(query, this.evaluacionReository, {
      relations: ['estudiante', 'clase','estado'],
      sortableColumns: ['id_evaluacion'],
      searchableColumns: [
        'id_evaluacion',
        'estudiante.nombres',
        'estudiante.apellidos',
        'estudiante.carnet',
      ],
      defaultSortBy: [['id_evaluacion', 'ASC']],
      filterableColumns: {
        'estudiante.id_estudiante': [FilterOperator.ILIKE],
        'clase.id_clase': [FilterOperator.ILIKE],
        tipo_evaluacion: [FilterOperator.EQ],
      },
    });
  }
  async getPromedioEstudiante(id_estudiante: string) {
    const evaluaciones = await this.evaluacionReository.find({
      where: { estudiante: { id_estudiante } },
    });
    const promedio =
      evaluaciones.reduce((total, evaluacion) => total + evaluacion.nota, 0) /
      evaluaciones.length;
    return promedio;
  }

  async confirmarEvaluacion(confirmarEvaluacion: ConfirmarEvaluacionDto) {
    const evaluaciones:Evaluacion[] = await this.evaluacionReository.find({
      where: {
        clase: { id_clase: confirmarEvaluacion.id_clase },
        tipo_evaluacion: confirmarEvaluacion.tipo_evaluacion,
      },
    });
    const estadoInativo = await this.estadoService.findByName(EnumEstados.INACTIVO);
    for (const evaluacion of evaluaciones) {
      evaluacion.estado  = estadoInativo;
      await this.evaluacionReository.save(evaluacion);
    }
    return 'Evaluaciones confirmadas';
  }

  findOne(id: number) {
    return `This action returns a #${id} evaluacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} evaluacione`;
  }
}
