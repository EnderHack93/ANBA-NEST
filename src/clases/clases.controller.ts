import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ClasesService } from './clases.service';
import { CreateClaseDto } from './dto/create-clase.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Clase } from './entities/clase.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { EnumRoles } from 'src/common/enums/roles.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorators';
import { UserInterfaceActive } from 'src/common/interfaces/user-active.interface';

@ApiTags("Clases")
@Controller('clases')
export class ClasesController {
  constructor(private readonly clasesService: ClasesService) {}

  @Post()
  create(@Body() createClaseDto: CreateClaseDto) {
    return this.clasesService.create(createClaseDto);
  }

  @Get()
  @Auth(EnumRoles.ADMIN)
  findAll(@Paginate() query:PaginateQuery):
  Promise<Paginated<Clase>> {
    return this.clasesService.findAll(query);
  }

  @Get('/getClasesByDocente')
  @ApiBearerAuth()
  @Auth(EnumRoles.DOCENTE)
  getClasesByDocente(@ActiveUser() user:UserInterfaceActive){
    return this.clasesService.getClasesByDocente(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clasesService.findOne(+id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClaseDto: UpdateClaseDto) {
    return this.clasesService.update(+id, updateClaseDto);
  }

  @Put(':id')
  remove(@Param('id') id: string) {
    return this.clasesService.remove(+id);
  }
}
