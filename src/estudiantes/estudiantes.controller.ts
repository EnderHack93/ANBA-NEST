import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Estudiante } from './entities/estudiante.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nest-lab/fastify-multer';
import { query } from 'express';
import { Inscrito } from 'src/inscritos/entities/inscrito.entity';

@Controller('estudiantes')
export class EstudiantesController {
  constructor(
    private readonly estudiantesService: EstudiantesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudiantesService.create(createEstudianteDto);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Estudiante>> {
    return this.estudiantesService.findAll(query);
  }

  @Get("noInscritos")
  findEstudiantesNoInscritos(
    @Query('id_materia')
    id_materia: number,
  ) {
    return this.estudiantesService.getEstudiantesPorMateria(
      id_materia,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estudiantesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto,
  ) {
    console.log(updateEstudianteDto);
    return this.estudiantesService.update(id, updateEstudianteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estudiantesService.remove(id);
  }
  @Put(':id')
  changeState(@Param('id') id: string) {
    return this.estudiantesService.changeState(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.cloudinaryService.uploadFile(file);
  }
}
