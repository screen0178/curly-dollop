import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCompanyDto: Prisma.CompanyCreateInput) {
    return this.companyService.create(createCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne({ id: +id });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: Prisma.CompanyUpdateInput,
  ) {
    return this.companyService.update({ id: +id }, updateCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove({ id: +id });
  }
}
