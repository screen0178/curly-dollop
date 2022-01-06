import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ArusKasService } from './arus-kas.service';
import { CreateArusKaDto } from './dto/create-arus-ka.dto';
import { UpdateArusKaDto } from './dto/update-arus-ka.dto';

@Controller('arus-kas')
export class ArusKasController {
  constructor(private readonly arusKasService: ArusKasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createArusKaDto: { data: Prisma.Arus_kasCreateInput },
  ) {
    return this.arusKasService.create(createArusKaDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: { userId: string; companyId: string }) {
    return this.arusKasService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.arusKasService.findOne({ id: +id });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateArusKaDto: { data: Prisma.Arus_kasUpdateInput },
  ) {
    return this.arusKasService.update({ id: +id }, updateArusKaDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.arusKasService.remove({ id: +id });
  }
}
