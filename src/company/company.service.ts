import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CompanyCreateInput) {
    const company = this.prisma.company.create({
      data,
    });

    return company;
  }

  async findAll() {
    const company = this.prisma.company.findMany();

    return company;
  }

  async findOne(where: Prisma.CompanyWhereUniqueInput) {
    const company = this.prisma.company.findUnique({
      where,
      include: {
        Arus_kas: true,
        User: true,
      },
    });

    return company;
  }

  async update(
    where: Prisma.CompanyWhereUniqueInput,
    data: Prisma.CompanyUpdateInput,
  ) {
    const company = this.prisma.company.update({
      where,
      data,
    });

    return company;
  }

  remove(where: Prisma.CompanyWhereUniqueInput) {
    const company = this.prisma.company.delete({
      where,
    });

    return company;
  }
}
