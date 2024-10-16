import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { CreateEstadoDto } from "./dto/create-estado.dto";
import { UpdateEstadoDto } from "./dto/update-estado.dto";
import { Estado } from "./entites/estado.entity";
import { EstadoService } from "./estado.service";


@Controller('estados')
export class EstadoController {
  constructor(private readonly estadoService: EstadoService) {}

  // Crear un nuevo estado
  @Post()
  async create(@Body() createEstadoDto: CreateEstadoDto): Promise<Estado> {
    return this.estadoService.create(createEstadoDto);
  }

  // Obtener todos los estados
  @Get()
  async findAll(): Promise<Estado[]> {
    return this.estadoService.findAll();
  }

  // Obtener un estado por ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Estado> {
    return this.estadoService.findOne(id);
  }

  // Obtener un estado por nombre
  @Get('nombre/:nombre')
  async findByName(@Param('nombre') nombre: string): Promise<Estado> {
    return this.estadoService.findByName(nombre);
  }

  // Modificar un estado existente
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEstadoDto: UpdateEstadoDto,
  ): Promise<Estado> {
    return this.estadoService.update(id, updateEstadoDto);
  }

  // Eliminar un estado
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.estadoService.remove(id);
  }
}
